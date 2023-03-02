import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Subscriber } from 'src/models/subscriber.entity';

@Injectable()
export class RabbitMqProvider {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private rabbitMqClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(RabbitMqProvider.name);

  async sendSubscriptionEmailNotification(
    notificationType,
    subscriber: Subscriber,
  ) {
    try {
      const newSubscriptionNotification =
        this._mapToNewSubscriptionNotification(subscriber);
      return this.rabbitMqClient.emit(
        notificationType,
        newSubscriptionNotification,
      );
    } catch (error) {
      this.logger.error('Failed to send notification', error.message);
      // Add retry mechanism.
      // Would not fail the request due to this, just log and handle in retry.
    }
  }

  private _mapToNewSubscriptionNotification(subscriber) {
    return {
      id: subscriber.id,
      firstName: subscriber.firstName,
      optIn: subscriber.subscription[0].optIn,
      campaignId: subscriber.subscription[0].campaign.id,
      campaignName: subscriber.subscription[0].campaign.campaignName,
    };
  }
}
