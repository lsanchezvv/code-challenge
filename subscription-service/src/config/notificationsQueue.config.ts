import { ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const getNotificationsQueueConfig = (): ClientsModuleOptions => {
  const configService = new ConfigService();
  const notificationsQueuePort = configService.get('NOTIFICATIONS_QUEUE_PORT');
  const notificationsQueueHost = configService.get('NOTIFICATIONS_QUEUE_HOST');
  const notificationsQueueName = configService.get('NOTIFICATIONS_QUEUE_NAME');

  if (
    !notificationsQueuePort ||
    !notificationsQueueHost ||
    !notificationsQueueName
  )
    throw new Error('Failed to load notifications queue config');

  return [
    {
      name: 'NOTIFICATION_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${notificationsQueueHost}:${notificationsQueuePort}`],
        queue: notificationsQueueName,
        queueOptions: {
          durable: false,
        },
      },
    },
  ];
};
