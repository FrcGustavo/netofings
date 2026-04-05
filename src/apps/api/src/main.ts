import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import chalk from 'chalk';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);

  // logger.log(`${chalk.green('[netofings-api-nest]')} server listening on port ${port}`);
  logger.log(`[netofings-api-nest] server listening on port ${port}`);
}

bootstrap();
