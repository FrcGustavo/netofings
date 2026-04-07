import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';

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
