import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Subscriber } from '../models/subscriber.entity';
import { Subscription } from '../models/subscription.entity';
import { CreateSubscriptionDto } from '../dtos/CreateSubscription.dto';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriberRepository } from '../repositories/subscriber.repository';
import { RabbitMqProvider } from '../providers/rabbitMq.provider';
import { CampaignRepository } from '../repositories/campaign.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private rabbitMqProvider: RabbitMqProvider,
    private subscriptionRepo: SubscriptionRepository,
    private subscriberRepo: SubscriberRepository,
    private campaignRepo: CampaignRepository,
  ) {}

  async getSubscriptionsByEmail(email) {
    const subscriptions = await this.subscriptionRepo.fetchSubscriptionsByEmail(
      email,
    );

    if (!subscriptions) {
      throw new NotFoundException('No subscriptions found');
    }

    return subscriptions;
  }

  async getSubscriptionDetailsByEmailAndId(email: string, id: number) {
    const subscription =
      await this.subscriptionRepo.fetchSubscriptionDetailsByEmailAndId(
        email,
        id,
      );

    if (!subscription) {
      throw new NotFoundException('Campaign does not exists');
    }
    return subscription;
  }

  async createSubscriptionWithSubscriber(
    createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const campaignId = createSubscriptionDto.campaignId;
    const campaign = await this.campaignRepo.fetchCampaignById(campaignId);

    if (!campaign) {
      throw new NotFoundException('Campaign does not exists');
    }

    let subscriber = await this.subscriberRepo.fetchSubscriberByEmail(
      createSubscriptionDto.email,
    );

    if (!subscriber) {
      subscriber = new Subscriber();
      subscriber.firstName = createSubscriptionDto.firstName;
      subscriber.email = createSubscriptionDto.email;
      subscriber.dateOfBirth = createSubscriptionDto.dateOfBirth;
      subscriber.gender = createSubscriptionDto.gender;
      subscriber.subscription = [];
    }

    const subscriptionExists =
      await this.subscriptionRepo.fetchSubscriptionBySubscriberIdAndCampaignId(
        subscriber.id,
        campaign.id,
      );

    if (subscriptionExists) {
      throw new ConflictException('Subscription already exists');
    }

    try {
      const subscription = new Subscription();
      subscription.campaign = campaign;
      subscription.optIn = true;
      subscriber.subscription = [...subscriber.subscription, subscription];
      await this.subscriptionRepo.createSubscriptionWithSubscriber(
        subscriber,
        subscription,
      );

      await this.rabbitMqProvider.sendSubscriptionEmailNotification(
        'subscription-created',
        subscriber,
      );
      return { id: subscription.id };
    } catch (error) {
      throw error;
    }
  }

  async cancelSubscriptionByEmailAndId(id: number, email: string) {
    const subscription =
      await this.subscriptionRepo.fetchSubscriptionDetailsByEmailAndId(
        email,
        id,
      );

    if (subscription.optIn) {
      subscription.optIn = false;
      await this.subscriptionRepo.updateSubscription(subscription);
      return;
    }

    // returning the same id since subscription is already cancelled. Avoid db update call.
    return;
  }
}
