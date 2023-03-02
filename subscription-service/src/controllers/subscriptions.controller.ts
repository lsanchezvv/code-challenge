import {
  Body,
  Param,
  Controller,
  Get,
  Patch,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiHeader,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiAcceptedResponse,
} from '@nestjs/swagger';
import { CreateSubscriptionDto } from '../dtos/CreateSubscription.dto';
import { SubscriptionsService } from '../services/subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionCreated } from '../dtos/SubscriptionCreated.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Jwt bearer token',
  })
  @ApiTags('Subscriptions')
  @ApiOkResponse({ description: 'Successfull request' })
  @ApiNotFoundResponse({ description: 'No Subscriptions found' })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @Get()
  getSubscriptions(@Request() req) {
    const email = req.user.username;
    return this.subscriptionService.getSubscriptionsByEmail(email);
  }

  @ApiTags('Subscriptions')
  @ApiCreatedResponse({ description: 'Subscription created' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @ApiResponse({ status: 409, description: 'Subscription already exists' })
  @Post()
  createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionCreated> {
    return this.subscriptionService.createSubscriptionWithSubscriber(
      createSubscriptionDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiTags('Subscriptions')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiHeader({
    name: 'Authorization',
    description: 'Jwt bearer token',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfull request' })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @Get(':id')
  getSubscription(@Request() req, @Param('id') id: number) {
    const email = req.user.username;
    return this.subscriptionService.getSubscriptionDetailsByEmailAndId(
      email,
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiTags('Subscriptions')
  @ApiHeader({
    name: 'Authorization',
    description: 'Jwt bearer token',
  })
  @ApiBearerAuth()
  @ApiAcceptedResponse({ description: 'Request processed' })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @Patch(':id/cancel')
  cancelSubscription(@Param('id') id: number, @Request() req) {
    const email = req.user.username;
    return this.subscriptionService.cancelSubscriptionByEmailAndId(id, email);
  }
}
