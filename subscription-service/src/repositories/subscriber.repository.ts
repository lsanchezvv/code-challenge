import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Subscriber } from '../models/subscriber.entity';
import { Subscription } from '../models/subscription.entity';

@Injectable()
export class SubscriberRepository {
  constructor(
    @InjectRepository(Subscription)
    private dataSource: DataSource,
  ) {}

  async fetchSubscriberByEmail(email: string) {
    return this.dataSource
      .createQueryBuilder()
      .select('subscriber')
      .from(Subscriber, 'subscriber')
      .where('subscriber.email = :email', { email })
      .getOne();
  }
}
