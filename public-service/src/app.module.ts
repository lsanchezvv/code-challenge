import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionService } from './services/subscription.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, HttpModule, UsersModule],
  controllers: [SubscriptionController, AuthController],
  providers: [SubscriptionService],
})
export class AppModule {}
