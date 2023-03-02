import { RmqOptions, Transport } from '@nestjs/microservices';

export const getNotificationsQueueConfig = (configService): RmqOptions => {
  const notificationsQueuePort = configService.get('NOTIFICATIONS_QUEUE_PORT');
  const notificationsQueueHost = configService.get('NOTIFICATIONS_QUEUE_HOST');
  const notificationsQueueName = configService.get('NOTIFICATIONS_QUEUE_NAME');

  return {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${notificationsQueueHost}:${notificationsQueuePort}`],
      queue: notificationsQueueName,
      queueOptions: {
        durable: false,
      },
    },
  };
};
