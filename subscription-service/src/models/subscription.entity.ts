import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Campaign } from './campaign.entity';
import { Subscriber } from './subscriber.entity';

@Entity()
@Unique(['subscriber', 'campaign'])
@Index(['subscriber', 'campaign'])
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.subscription, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  campaign: Campaign;

  @ManyToOne(() => Subscriber, (subscriber) => subscriber.subscription, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subscriber: Subscriber;

  @Column('boolean')
  optIn: boolean;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
