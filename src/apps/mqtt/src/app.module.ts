import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/config.schema';
import envConfig from './config/env.config';
import { DbModule } from './db/db.module';
import { BrokerModule } from './mqtt/broker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [envConfig],
      validationSchema: envValidationSchema,
    }),
    DbModule,
    BrokerModule,
  ],
})
export class AppModule {}
