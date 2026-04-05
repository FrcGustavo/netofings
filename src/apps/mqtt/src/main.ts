import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import chalk from 'chalk';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();

//   logger.log(chalk.green('[netofings-mqtt-nest]') + ' broker application context started');
    logger.log('[netofings-mqtt-nest] broker application context started');
}

bootstrap();
