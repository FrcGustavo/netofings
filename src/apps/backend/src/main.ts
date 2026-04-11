import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883',
      keepalive: 30,
      reconnectPeriod: 1000,
      connectTimeout: 30000,
      clean: true,
      protocolVersion: 4,
    },
  });

  await app.init();
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
