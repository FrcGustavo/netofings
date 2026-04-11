import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';

@Controller('agents/:agentId/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  create(
    @Param('agentId') agentId: string,
    @Body() createMetricDto: CreateMetricDto,
  ) {
    return this.metricsService.create(agentId, createMetricDto);
  }

  @Get()
  findAll(@Param('agentId') agentId: string) {
    return this.metricsService.findAll(agentId);
  }

  @Get(':id')
  findOne(@Param('agentId') agentId: string, @Param('id') id: string) {
    return this.metricsService.findOne(agentId, id);
  }

  @Patch(':id')
  update(
    @Param('agentId') agentId: string,
    @Param('id') id: string,
    @Body() updateMetricDto: UpdateMetricDto,
  ) {
    return this.metricsService.update(agentId, id, updateMetricDto);
  }

  @Delete(':id')
  remove(@Param('agentId') agentId: string, @Param('id') id: string) {
    return this.metricsService.remove(agentId, id);
  }
}
