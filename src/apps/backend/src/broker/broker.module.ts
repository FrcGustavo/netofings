import { Module } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { AgentsModule } from '../agents/agents.module';
import { MetricsModule } from '../metrics/metrics.module';
import { UsersModule } from '../users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [AgentsModule, MetricsModule, UsersModule, TokensModule],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
