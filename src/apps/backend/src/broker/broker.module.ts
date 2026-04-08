import { Module } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { AgentsModule } from '../agents/agents.module';
import { MetricsModule } from '../metrics/metrics.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AgentsModule, MetricsModule, UsersModule],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
