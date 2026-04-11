import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  port: configService.get('POSTGRES_PORT'),
  host: configService.get('POSTGRES_HOST'),
  synchronize: false,
  logging: true,
  entities: ['src/*/*/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
