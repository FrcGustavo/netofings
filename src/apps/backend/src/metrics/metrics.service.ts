import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { Metric } from './entities/metric.entity';
import { Agent } from '../agents/entities/agent.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric)
    private readonly metricsRepository: Repository<Metric>,
  ) {}

  async create(agentId: string, createMetricDto: CreateMetricDto) {
    const metric = this.metricsRepository.create(createMetricDto);
    return this.metricsRepository.save(metric);
  }

  async createForAgent(agent: Agent, type: string, value: unknown) {
    const metric = this.metricsRepository.create({
      type,
      value: this.normalizeValue(value),
      agent,
    });

    return this.metricsRepository.save(metric);
  }

  async findAll(agentId: string) {
    const metrics = await this.metricsRepository.find({
      where: { agent: { id: agentId } },
      order: { createdAt: 'DESC' },
    });

    return metrics.reduce<Record<string, Metric[]>>((acc, metric) => {
      const bucket = acc[metric.type] ?? [];
      bucket.push(metric);
      acc[metric.type] = bucket;
      return acc;
    }, {});
  }

  findOne(agentId: string, id: string) {
    return this.metricsRepository.findOneBy({ id });
  }

  async update(agentId: string, id: string, updateMetricDto: UpdateMetricDto) {
    await this.metricsRepository.update(id, updateMetricDto);
    return this.findOne(agentId, id);
  }

  remove(agentId: string, id: string) {
    return this.metricsRepository.delete(id);
  }

  private normalizeValue(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return JSON.stringify(value ?? null);
  }
}
