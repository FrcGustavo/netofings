import { Controller, Get, NotFoundException, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthUser } from '../../auth/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UuidParamDto } from '../../common/dto/uuid-param.dto';
import { AgentsService } from './agents.service';

@Controller()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('agents')
  async findAgents(@CurrentUser() user: AuthUser) {

    if (!user.username) {
      throw new UnauthorizedException('Not authorized');
    }

    return this.agentsService.findAgentsByUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('agent/:uuid')
  async findOne(@Param() params: UuidParamDto) {
    const { uuid } = params;
    const agent = await this.agentsService.findByUuid(uuid);

    if (!agent) {
      throw new NotFoundException(`Agent not found with uuid ${uuid}`);
    }

    return agent;
  }
}
