import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MetricsReadPermissionGuard } from '../../auth/permissions.guard';
import { MetricParamDto } from '../../common/dto/metric-param.dto';
import { UuidParamDto } from '../../common/dto/uuid-param.dto';
import { MetricsService } from './metrics.service';

@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @UseGuards(JwtAuthGuard, MetricsReadPermissionGuard)
  @Get('metrics/:uuid')
  async findTypes(@Param() params: UuidParamDto) {
    const { uuid } = params;
    const metrics = await this.metricsService.findTypesByAgent(uuid);

    if (!metrics || metrics.length === 0) {
      throw new NotFoundException(`Metrics not found for agent with uuid ${uuid}`);
    }

    return metrics;
  }

  @UseGuards(JwtAuthGuard)
  @Get('metrics/:uuid/:type')
  async findByType(@Param() params: MetricParamDto) {
    const { uuid, type } = params;
    const metrics = await this.metricsService.findByTypeAndAgent(type, uuid);

    if (!metrics || metrics.length === 0) {
      throw new NotFoundException(`Metrics (${type}) not found for agent with uuid ${uuid}`);
    }

    return metrics;
  }
}
