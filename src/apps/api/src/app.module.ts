import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envConfig from './config/env.config';
import { envValidationSchema } from './config/config.schema';
import { DbModule } from './db/db.module';
import { AgentsModule } from './modules/agents/agents.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [envConfig],
      validationSchema: envValidationSchema,
    }),
    DbModule,
    AgentsModule,
    MetricsModule,
  ],
})
export class AppModule {}
