import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadPgDbConfig } from './config/typeorm.config';
import { Subscriber } from './models/subscriber.entity';
import { Subscription } from './models/subscription.entity';
import { Campaign } from './models/campaign.entity';
import { SubscriptionsService } from './services/subscription.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { CustomAuthStrategy } from './auth/custom.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { SubscriberRepository } from './repositories/subscriber.repository';
import { RabbitMqProvider } from './providers/rabbitMq.provider';
import { CampaignRepository } from './repositories/campaign.repository';
import { getAuthConfig } from './config/auth.config';
import { getNotificationsQueueConfig } from './config/notificationsQueue.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register(getNotificationsQueueConfig()),
    PassportModule,
    JwtModule.register(getAuthConfig()),
    TypeOrmModule.forRoot(loadPgDbConfig()),
    TypeOrmModule.forFeature([Subscriber, Subscription, Campaign]),
  ],
  controllers: [SubscriptionsController, AuthController],
  providers: [
    RabbitMqProvider,
    SubscriptionsService,
    AuthService,
    CustomAuthStrategy,
    JwtStrategy,
    SubscriptionRepository,
    SubscriberRepository,
    CampaignRepository,
  ],
})
export class AppModule {}
