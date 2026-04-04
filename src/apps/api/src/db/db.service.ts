import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService {
  private services: any | null = null;

  constructor(private readonly configService: ConfigService) {}

  async getServices() {
    if (this.services) {
      return this.services;
    }

    const setupDb = require('netofingsdb');
    const dbConfig = this.configService.get('db');
    this.services = await setupDb(dbConfig);
    return this.services;
  }

  async getAgentService() {
    const services = await this.getServices();
    return services.Agent;
  }

  async getMetricService() {
    const services = await this.getServices();
    return services.Metric;
  }
}
