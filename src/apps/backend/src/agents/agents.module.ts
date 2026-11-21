import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { Agent } from './entities/agent.entity';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([Agent]), TokensModule],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
