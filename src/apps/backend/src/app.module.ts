import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrokerModule } from './broker/broker.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { MetricsModule } from './metrics/metrics.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        type: 'postgres',
        host: configService.postgres.host,
        port: Number(configService.postgres.port),
        username: configService.postgres.user,
        password: configService.postgres.password,
        database: configService.postgres.dbName,
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    BrokerModule,
    UsersModule,
    AgentsModule,
    MetricsModule,
    TokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
