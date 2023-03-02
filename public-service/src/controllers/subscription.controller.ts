import {
  Body,
  Param,
  Controller,
  Get,
  Patch,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SubscriptionDto } from 'src/dtos/Subscription.dto';
import { SerializeDto } from 'src/interceptors/classInterceptor';
import { SubscriptionService } from 'src/services/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getSubscriptions(@Headers('authorization') authorization: string) {
    const jwtToken = authorization.split(' ')[1];
    return this.subscriptionService.getSubscriptions(jwtToken);
  }

  @Post()
  createSubscription(@Body() createSubscriptionDto: any) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @UseGuards(JwtAuthGuard)
  @SerializeDto(SubscriptionDto)
  @Get(':id')
  getSubscription(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    console.log('sub controller')
    return this.subscriptionService.getSubscription(id, authorization);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancelSubscription(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    return this.subscriptionService.cancelSubscription(id, authorization);
  }
}
