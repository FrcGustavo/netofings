import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Agent } from 'src/agents/entities/agent.entity';

@Controller()
export class BrokerController {
  private readonly logger = new Logger(BrokerController.name);

  @MessagePattern('agent/message')
  handleAgentMessage(@Payload() payload: { agent: Agent }) {
    this.logger.log(`Procesando métricas para el agente: ${payload.agent.id}`);
  }

  @MessagePattern('agent/connected')
  handleAgentConnected(@Payload() payload: { agent: Agent }) {
    this.logger.log(`Agente reportado como conectado: ${payload.agent.id}`);
  }
}
