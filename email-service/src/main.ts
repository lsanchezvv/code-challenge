import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getNotificationsQueueConfig } from './config/notificationsQueue.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const notificationQueueConfig = getNotificationsQueueConfig(configService);

  app.connectMicroservice<MicroserviceOptions>(notificationQueueConfig);

  app.startAllMicroservices();
}
bootstrap();
