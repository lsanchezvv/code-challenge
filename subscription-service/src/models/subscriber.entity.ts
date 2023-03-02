import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Subscription } from './subscription.entity';
import { GenderEnum } from '../common/types';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: true })
  firstName: string;

  @Column({ unique: true, type: 'text' })
  email: string;

  @Column('date')
  dateOfBirth: Date;

  @Column('enum', { enum: GenderEnum, default: GenderEnum.NOT_DISCLOSED })
  gender: GenderEnum;

  @OneToMany(() => Subscription, (subscription) => subscription.subscriber)
  subscription: Subscription[];

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
