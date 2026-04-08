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
      uuid: string;
      username: string;
      name: string;
      hostname: string;
      pid: number;
    },
    user: User,
  ) {
    const existing = await this.findOne(payload.uuid);

    const data = {
      uuid: payload.uuid,
      username: payload.username,
      name: payload.name,
      hostname: payload.hostname,
      pid: payload.pid,
      connected: true,
      user,
    };

    if (existing) {
      await this.agentsRepository.update({ uuid: payload.uuid }, data);
      return this.findOne(payload.uuid);
    }

    const agent = this.agentsRepository.create(data);
    return this.agentsRepository.save(agent);
  }

  async markDisconnected(uuid: string) {
    await this.agentsRepository.update({ uuid }, { connected: false });
    return this.findOne(uuid);
  }

  findAll() {
    return this.agentsRepository.find();
  }

  findOne(uuid: string) {
    return this.agentsRepository.findOneBy({ uuid });
  }

  async update(uuid: string, updateAgentDto: UpdateAgentDto) {
    await this.agentsRepository.update({ uuid }, updateAgentDto);
    return this.findOne(uuid);
  }

  remove(uuid: string) {
    return this.agentsRepository.delete({ uuid });
  }
}
