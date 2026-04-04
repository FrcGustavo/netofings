import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class MetricsService {
  constructor(private readonly dbService: DbService) {}

  async findTypesByAgent(uuid: string) {
    const metricService = await this.dbService.getMetricService();
    return metricService.findByAgentUuid(uuid);
  }

  async findByTypeAndAgent(type: string, uuid: string) {
    const metricService = await this.dbService.getMetricService();
    return metricService.findByTypeAgentUuid(type, uuid);
  }
}
