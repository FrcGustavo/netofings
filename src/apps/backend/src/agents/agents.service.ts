import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentsRepository: Repository<Agent>,
  ) {}

  async create(createAgentDto: CreateAgentDto) {
    const agent = this.agentsRepository.create(createAgentDto);

    return this.agentsRepository.save(agent);
  }

  async upsertFromMqtt(
    payload: {
      id: string;
      username: string;
      name: string;
      hostname: string;
      pid: number;
    },
    user: User,
  ) {
    const existing = await this.findOne(payload.id);

    const data = {
      username: payload.username,
      name: payload.name,
      hostname: payload.hostname,
      pid: payload.pid,
      connected: true,
      user,
    };

    if (existing) {
      await this.agentsRepository.update({ id: payload.id }, data);
      return this.findOne(payload.id);
    }

    const agent = this.agentsRepository.create(data);
    return this.agentsRepository.save(agent);
  }

  async markDisconnected(id: string) {
    await this.agentsRepository.update({ id }, { connected: false });
    return this.findOne(id);
  }

  findAll() {
    return this.agentsRepository.find();
  }

  findOne(id: string) {
    return this.agentsRepository.findOneBy({ id });
  }

  async update(id: string, updateAgentDto: UpdateAgentDto) {
    await this.agentsRepository.update({ id }, updateAgentDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.agentsRepository.delete({ id });
  }
}
