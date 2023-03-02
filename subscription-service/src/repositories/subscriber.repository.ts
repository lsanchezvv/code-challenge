import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Subscriber } from '../models/subscriber.entity';

@Injectable()
export class SubscriberRepository {
  constructor(
    @InjectRepository(Subscriber)
    private dataSource: DataSource,
  ) {}

  async fetchSubscriberByEmail(email: string) {
    return this.dataSource
      .createQueryBuilder()
      .select('subscriber')
      .from(Subscriber, 'subscriber')
      .leftJoinAndSelect('subscriber.subscription', 'subscriptions')
      .where('subscriber.email = :email', { email })
      .getOne();
  }
}
