import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Aedes } from 'aedes';
import { createServer } from 'net';
import { AgentsService } from '../agents/agents.service';
import { MetricsService } from '../metrics/metrics.service';
import { UsersService } from '../users/users.service';

interface AgentPayload {
  uuid: string;
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

@Injectable()
export class BrokerService implements OnModuleInit {
  private readonly logger = new Logger(BrokerService.name);
  private aedes!: Aedes;
  private readonly clients = new Map<string, string>();

  constructor(
    private readonly agentsService: AgentsService,
    private readonly metricsService: MetricsService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    const port = 1883;
    this.aedes = await Aedes.createBroker();
    const server = createServer(this.aedes.handle);

    server.listen(port, () => {
      this.logger.log(`MQTT broker listening on port ${port}`);
    });

    this.setupBrokerEvents();
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
  }

  private async handleAgentMessage(
    packet: { topic: string; payload: string | Buffer },
    client: { id: string } | null,
  ) {
    try {
      if (!client || packet.topic !== 'agent/message') {
        return;
      }

      const payload = this.parsePayload(packet.payload);
      if (!payload) {
        return;
      }

      /**
       * For simplicity, we're using a single "mqtt-system" user for all MQTT agents.
       * In a real application, you might want to implement a more robust authentication and user management system.
       */
      const user = await this.usersService.findOrCreateByName('mqtt-system');
      const agent = await this.agentsService.upsertFromMqtt(
        payload.agent,
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
            uuid: agent.uuid,
            name: agent.name,
            hostname: agent.hostname,
            pid: agent.pid,
            connected: agent.connected,
          },
        });
      }

      this.clients.set(client.id, agent.uuid);
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
        !parsed?.agent?.uuid ||
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
