import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { Metric } from './entities/metric.entity';

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
}
