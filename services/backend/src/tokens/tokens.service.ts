import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentToken } from './entities/agent-token.entity';
import { Agent } from '../agents/entities/agent.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(AgentToken)
    private readonly agentTokenRepository: Repository<AgentToken>,
  ) {}

  async createForAgent(
    agent: Agent,
    descripcion?: string,
  ): Promise<AgentToken> {
    const token = new AgentToken();
    token.token = randomBytes(32).toString('hex');
    token.descripcion = descripcion || agent.username;
    token.agent = agent;

    return this.agentTokenRepository.save(token);
  }

  async findByAgent(agent: Agent): Promise<AgentToken[]> {
    return this.agentTokenRepository.find({ where: { agent, revoked: false } });
  }

  async findByToken(token: string): Promise<AgentToken | null> {
    return this.agentTokenRepository.findOne({
      where: { token, revoked: false },
      relations: ['agent', 'agent.user'],
    });
  }

  async revoke(tokenId: string): Promise<void> {
    await this.agentTokenRepository.update({ id: tokenId }, { revoked: true });
  }
}
