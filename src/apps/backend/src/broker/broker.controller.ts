import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class BrokerController {
  private readonly logger = new Logger(BrokerController.name);

  @MessagePattern('agent/message')
  handleAgentMessage(@Payload() payload: any) {
    this.logger.log(
      `Procesando métricas para el agente: ${payload.agent.uuid}`,
    );
  }

  @MessagePattern('agent/connected')
  handleAgentConnected(@Payload() payload: any) {
    this.logger.log(`Agente reportado como conectado: ${payload.agent.uuid}`);
  }
}
