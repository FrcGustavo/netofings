import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { BrokerService } from './broker.service';

@Module({
  imports: [DbModule],
  providers: [BrokerService],
})
export class BrokerModule {}
