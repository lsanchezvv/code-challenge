import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Subscriber } from '../models/subscriber.entity';
import { Subscription } from '../models/subscription.entity';
import { SaveSubscriptionDto } from '../dtos/SaveSubscription.dto';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private dataSource: DataSource,
  ) {}

  async fetchSubscriptionsByEmail(email: string) {
    const subscriber = await this.dataSource
      .createQueryBuilder()
      .select('subscriber')
      .from(Subscriber, 'subscriber')
      .where('subscriber.email = :email', { email })
      .leftJoinAndSelect('subscriber.subscription', 'subscription')
      .getOne();

    return subscriber?.subscription || null;
  }

  async fetchSubscriptionDetailsByEmailAndId(email: string, id: number) {
    const subscription = await this.dataSource
      .createQueryBuilder()
      .select('subscription')
      .from(Subscription, 'subscription')
      .leftJoinAndSelect('subscription.subscriber', 'subscriber')
      .leftJoinAndSelect('subscription.campaign', 'campaign')
      .where('subscription.id = :id', { id })
      .andWhere('subscriber.email = :email', { email })
      .getOne();

    return subscription;
  }

  async fetchSubscriptionBySubscriberIdAndCampaignId(
    subscriberId: number,
    campaingId: number,
  ) {
    const subscription = await this.dataSource
      .createQueryBuilder()
      .select('subscription')
      .from(Subscription, 'subscription')
      .leftJoinAndSelect('subscription.subscriber', 'subscriber')
      .leftJoinAndSelect('subscription.campaign', 'campaign')
      .where('subscriber.id = :subscriberId', { subscriberId })
      .andWhere('campaign.id = :campaingId', { campaingId })
      .getOne();
    return subscription;
  }

  async createSubscriptionWithSubscriber(subscriber, subscription) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.save(subscription);
      await queryRunner.manager.save(subscriber);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('an error inserting subscription', error.message)
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async saveSubscription(subscription: SaveSubscriptionDto) {
    const createdSubscription = await this.subscriptionRepository.create(
      subscription,
      );
    return this.subscriptionRepository.save(createdSubscription);
  }

  async updateSubscription(subscription: Subscription) {
    const updatedSubscription = await this.subscriptionRepository.save(
      subscription,
    );
    return updatedSubscription.id;
  }
}
