import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokensService } from '../tokens/tokens.service';
import { PayloadToken } from 'src/auth/models/token.model';

@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly tokensService: TokensService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() createAgentDto: CreateAgentDto) {
    const user = req.user as PayloadToken;
    const agent = await this.agentsService.create(user.sub, createAgentDto);
    const tokens = await this.tokensService.findByAgent(agent);
    const apiToken = tokens.length > 0 ? tokens[0].token : null;

    return {
      id: agent.id,
      username: agent.username,
      apiToken,
      hostname: agent.hostname,
      pid: agent.pid,
      connected: agent.connected,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    };
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as PayloadToken;

    return this.agentsService.findAll(user.sub);
  }

  @Get(':uuid')
  async findOne(@Req() req: Request, @Param('uuid') uuid: string) {
    const user = req.user as PayloadToken;
    const agent = await this.agentsService.findOne(user.sub, uuid);

    return agent;
  }

  @Patch(':uuid')
  async update(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    const user = req.user as PayloadToken;

    return this.agentsService.update(user.sub, uuid, updateAgentDto);
  }

  @Delete(':uuid')
  async remove(@Req() req: Request, @Param('uuid') uuid: string) {
    const user = req.user as PayloadToken;

    return this.agentsService.remove(user.sub, uuid);
  }
  /**
   * Genera un nuevo token para un agente específico.
   * Protegido por JWT.
   */
  @Post(':uuid/tokens')
  async generateAgentToken(
    @Req() req: Request,
    @Param('uuid') agentId: string,
    @Body('descripcion') descripcion: string,
  ) {
    const user = req.user as PayloadToken;
    const agent = await this.agentsService.findOne(user.sub, agentId);
    if (!agent) {
      throw new NotFoundException('Agente no encontrado');
    }

    const tokenEntity = await this.tokensService.createForAgent(
      agent,
      descripcion,
    );
    return { token: tokenEntity.token, descripcion: tokenEntity.descripcion };
  }
}
