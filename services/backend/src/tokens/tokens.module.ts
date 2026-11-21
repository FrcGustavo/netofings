import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentToken } from './entities/agent-token.entity';
import { TokensService } from './tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgentToken])],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
