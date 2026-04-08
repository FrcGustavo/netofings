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

  async create(createMetricDto: CreateMetricDto) {
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

  findAll() {
    return this.metricsRepository.find();
  }

  findOne(id: number) {
    return this.metricsRepository.findOneBy({ id });
  }

  async update(id: number, updateMetricDto: UpdateMetricDto) {
    await this.metricsRepository.update(id, updateMetricDto);
    return this.findOne(id);
  }

  remove(id: number) {
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
