import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';
import { DbService } from '../db/db.service';
import { parsePayload } from './utils';

@Injectable()
export class BrokerService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(BrokerService.name);
  private server: any;
  private readonly clients = new Map<string, any>();
  private agentService: any;
  private metricService: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: DbService,
  ) {}

  async onModuleInit() {
    // Mosca uses an old jsonschema API that passes schema ids as strings.
    // Newer jsonschema releases require schema objects, so we normalize here.
    const jsonschema = require('jsonschema');
    const Validator = jsonschema?.Validator;
    if (Validator?.prototype?.validate && !Validator.prototype.__netofingsCompatPatched) {
      const originalValidate = Validator.prototype.validate;
      Validator.prototype.validate = function patchedValidate(instance: unknown, schema: unknown, options: unknown) {
        if (typeof schema === 'string') {
          const ref = this.schemas?.[schema] ?? this.schemas?.[`${schema}#`];
          schema = ref?.schema ?? ref ?? schema;
        }
        return originalValidate.call(this, instance, schema, options);
      };
      Validator.prototype.__netofingsCompatPatched = true;
    }

    const mosca = require('mosca');
    const redis = require('redis');

    const mqttConfig = this.configService.get('mqtt') as { port: number };
    const backend = {
      type: 'redis',
      redis,
      return_buffers: true,
    };

    const settings = {
      port: mqttConfig.port,
      backend,
    };

    this.server = new mosca.Server(settings);

    const services = await this.dbService.getServices();
    this.agentService = services.Agent;
    this.metricService = services.Metric;

    this.registerHandlers();

    this.logger.log(`[netofings-mqtt-nest] server is running on port ${mqttConfig.port}`);
  }

  onApplicationShutdown() {
    if (this.server && typeof this.server.close === 'function') {
      this.server.close();
    }
  }

  private registerHandlers() {
    this.server.on('clientConnected', (client: { id: string }) => {
      this.clients.set(client.id, null);
      this.logger.debug(`Client Connected: ${client.id}`);
    });

    this.server.on('clientDisconnected', async (client: { id: string }) => {
      this.logger.debug(`Client Disconnected: ${client.id}`);
      const agent = this.clients.get(client.id);

      if (!agent) {
        return;
      }

      agent.connected = false;

      try {
        await this.agentService.createOrUpdate(agent);
      } catch (error: any) {
        this.logger.error(error.message, error.stack);
        return;
      }

      this.clients.delete(client.id);

      this.server.publish({
        topic: 'agent/disconnected',
        payload: JSON.stringify({ agent: { uuid: agent.uuid } }),
      });
    });

    this.server.on('published', async (packet: { topic: string; payload: unknown }, client: { id: string }) => {
      if (packet.topic !== 'agent/message') {
        return;
      }

      const payload = parsePayload(packet.payload) as any;
      if (!payload || !payload.agent) {
        return;
      }

      payload.agent.connected = true;

      let agent;
      try {
        agent = await this.agentService.createOrUpdate(payload.agent);
      } catch (error: any) {
        this.logger.error(error.message, error.stack);
        return;
      }

      if (!this.clients.get(client.id)) {
        this.clients.set(client.id, agent);
        this.server.publish({
          topic: 'agent/connected',
          payload: JSON.stringify({
            agent: {
              uuid: agent.uuid,
              name: agent.name,
              hostname: agent.hostname,
              pid: agent.pid,
              connected: agent.connected,
            },
          }),
        });
      }

      const metrics = Array.isArray(payload.metrics) ? payload.metrics : [];
      try {
        await Promise.all(metrics.map((metric: any) => this.metricService.create(agent.uuid, metric)));
      } catch (error: any) {
        this.logger.error(error.message, error.stack);
      }
    });

    this.server.on('error', (error: Error) => {
      this.logger.error(error.message, error.stack);
      process.exit(1);
    });
  }
}
