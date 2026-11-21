import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { User } from '../users/entities/user.entity';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentsRepository: Repository<Agent>,
    private readonly tokensService: TokensService,
  ) {}

  async create(userId: string, createAgentDto: CreateAgentDto) {
    const agent = this.agentsRepository.create({
      name: '', // ignore name
      username: createAgentDto.username,
      hostname: '',
      pid: 0,
      connected: false,
      user: { id: userId },
    });
    const savedAgent = await this.agentsRepository.save(agent);
    await this.tokensService.createForAgent(savedAgent);

    return savedAgent;
  }

  async upsertFromMqtt(
    payload: {
      id: string;
      username: string;
      name?: string;
      hostname: string;
      pid: number;
    },
    user: User,
  ) {
    const existing = await this.agentsRepository.findOneBy({ id: payload.id });
    const data = {
      username: payload.username,
      name: '', // ignorar name
      hostname: payload.hostname,
      pid: payload.pid,
      connected: true,
      user,
    };
    if (existing) {
      await this.agentsRepository.update({ id: payload.id }, data);
      return this.agentsRepository.findOneBy({ id: payload.id });
    }
    const agent = this.agentsRepository.create(data);
    const savedAgent = await this.agentsRepository.save(agent);
    // Crear token asociado usando el servicio
    await this.tokensService.createForAgent(savedAgent);
    return savedAgent;
  }

  async markDisconnected(id: string) {
    await this.agentsRepository.update({ id }, { connected: false });
    return this.agentsRepository.findOneBy({ id });
  }

  findAll(userId: string) {
    return this.agentsRepository.find({
      where: { user: { id: userId } },
      relations: ['tokens'],
    });
  }

  findOne(userId: string, id: string) {
    return this.agentsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['tokens'],
    });
  }

  async update(userId: string, id: string, updateAgentDto: UpdateAgentDto) {
    await this.agentsRepository.update(
      { id, user: { id: userId } },
      updateAgentDto,
    );
    return this.findOne(userId, id);
  }

  remove(userId: string, id: string) {
    return this.agentsRepository.delete({ id, user: { id: userId } });
  }
}
