import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Aedes } from 'aedes';
import type { AuthenticateError } from 'aedes';
import { createServer } from 'net';
import { AgentsService } from '../agents/agents.service';
import { MetricsService } from '../metrics/metrics.service';
import { TokensService } from '../tokens/tokens.service';
import { User } from '../users/entities/user.entity';

interface AgentPayload {
  id?: string;
  username: string;
  name: string;
  hostname: string;
  pid: number;
}

interface MetricPayload {
  type: string;
  value: unknown;
}

interface AgentMessagePayload {
  agent: AgentPayload;
  metrics: MetricPayload[];
  timestamp?: number;
}

type AuthenticatedAgentContext = {
  agentId: string;
  userId: string;
  username: string;
};

type AuthenticateCallback = Parameters<NonNullable<Aedes['authenticate']>>[3];
type AuthenticatePassword = Parameters<NonNullable<Aedes['authenticate']>>[2];

@Injectable()
export class BrokerService implements OnModuleInit {
  private readonly logger = new Logger(BrokerService.name);
  private aedes!: Aedes;
  private readonly clients = new Map<string, string>();
  private readonly authenticatedAgents = new Map<
    string,
    AuthenticatedAgentContext
  >();

  constructor(
    private readonly agentsService: AgentsService,
    private readonly metricsService: MetricsService,
    private readonly tokensService: TokensService,
  ) {}

  async onModuleInit() {
    const port = 1883;
    this.aedes = await Aedes.createBroker();
    this.aedes.authenticate = this.authenticateClient;
    const server = createServer(this.aedes.handle);
    server.listen(port, () => {
      this.logger.log(`MQTT broker listening on port ${port}`);
    });

    this.setupBrokerEvents();
  }

  private readonly authenticateClient: NonNullable<Aedes['authenticate']> = (
    client,
    _username,
    password,
    callback,
  ) => {
    void this.runAuthentication(client.id, password, callback);
  };

  private async runAuthentication(
    clientId: string,
    password: AuthenticatePassword,
    callback: AuthenticateCallback,
  ) {
    try {
      const token = this.extractToken(password);
      if (!token) {
        return callback(this.createAuthError('No token provided'), false);
      }

      const agentToken = await this.tokensService.findByToken(token);
      if (!agentToken || !agentToken.agent?.user) {
        return callback(this.createAuthError('Invalid token'), false);
      }

      this.authenticatedAgents.set(clientId, {
        agentId: agentToken.agent.id,
        userId: agentToken.agent.user.id,
        username: agentToken.agent.username,
      });

      callback(null, true);
    } catch {
      callback(this.createAuthError('Authentication error'), false);
    }
  }

  private extractToken(password: AuthenticatePassword) {
    if (!password) {
      return null;
    }

    return password.toString('utf8');
  }

  private createAuthError(message: string): AuthenticateError {
    const error = new Error(message) as AuthenticateError;
    error.returnCode = 4 as AuthenticateError['returnCode'];
    return error;
  }

  private setupBrokerEvents() {
    this.aedes.on('client', (client) => {
      this.logger.log(`[+] Client Connected: ${client.id}`);
      this.clients.set(client.id, '');
    });

    this.aedes.on('clientDisconnect', (client) => {
      void this.handleClientDisconnect(client);
    });

    this.aedes.on('publish', (packet, client) => {
      void this.handleAgentMessage(packet, client);
    });
  }

  private async handleClientDisconnect(client: { id: string }) {
    this.logger.log(`[-] Client Disconnected: ${client.id}`);

    const agentUuid = this.clients.get(client.id);

    if (agentUuid) {
      try {
        await this.agentsService.markDisconnected(agentUuid);
      } catch (error) {
        this.logger.error('Error marking agent as disconnected', error);
      }

      this.publishInternalMessage('agent/disconnected', {
        agent: { uuid: agentUuid },
      });
    }

    this.clients.delete(client.id);
    this.authenticatedAgents.delete(client.id);
  }

  private async handleAgentMessage(
    packet: { topic: string; payload: string | Buffer },
    client: { id: string } | null,
  ) {
    try {
      if (!client || packet.topic !== 'agent/message') {
        return;
      }

      const authenticatedAgent = this.authenticatedAgents.get(client.id);
      if (!authenticatedAgent) {
        this.logger.warn(
          `Missing authenticated agent context for client ${client.id}`,
        );
        return;
      }

      const payload = this.parsePayload(packet.payload);
      if (!payload) {
        return;
      }

      if (payload.agent.id && payload.agent.id !== authenticatedAgent.agentId) {
        this.logger.warn(
          `Client ${client.id} published for agent ${payload.agent.id} but token is bound to ${authenticatedAgent.agentId}; using authenticated agent id`,
        );
      }

      const user = { id: authenticatedAgent.userId } as User;

      const agent = await this.agentsService.upsertFromMqtt(
        {
          ...payload.agent,
          id: authenticatedAgent.agentId,
          username: authenticatedAgent.username,
        },
        user,
      );

      if (!agent) {
        return;
      }

      await Promise.all(
        payload.metrics.map((metric) =>
          this.metricsService.createForAgent(agent, metric.type, metric.value),
        ),
      );

      if (!this.clients.get(client.id)) {
        this.publishInternalMessage('agent/connected', {
          agent: {
            id: agent.id,
            name: agent.name,
            hostname: agent.hostname,
            pid: agent.pid,
            connected: agent.connected,
          },
        });
      }

      this.clients.set(client.id, agent.id);
    } catch (error) {
      this.logger.error('Error processing agent/message payload', error);
    }
  }

  private parsePayload(payload: string | Buffer): AgentMessagePayload | null {
    try {
      const raw =
        typeof payload === 'string' ? payload : payload.toString('utf8');
      const parsed = JSON.parse(raw) as AgentMessagePayload;
      if (
        !parsed?.agent ||
        !parsed.agent.username ||
        !parsed.agent.name ||
        !parsed.agent.hostname ||
        typeof parsed.agent.pid !== 'number' ||
        !Array.isArray(parsed.metrics)
      ) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  private publishInternalMessage(
    topic: string,
    payload: Record<string, unknown>,
  ) {
    if (!topic) {
      return;
    }

    this.aedes.publish(
      {
        topic,
        payload: Buffer.from(JSON.stringify(payload)),
        cmd: 'publish',
        qos: 0,
        dup: false,
        retain: false,
      },
      () => {
        //
      },
    );
  }
}
