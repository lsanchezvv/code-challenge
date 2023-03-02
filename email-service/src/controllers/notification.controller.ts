import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { SubscriptionDto } from 'src/dtos/Subscription.dto';
import { NotificationService } from 'src/services/notification.service';

@Controller()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @EventPattern('subscription-created')
  async handleSubscriptionEvent(data: Record<string, SubscriptionDto>) {
    return this.notificationService.handleEmailNotification(data);
  }
}
