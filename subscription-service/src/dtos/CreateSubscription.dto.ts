import { CreateSubscriberDto } from './CreateSubscriber.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto extends CreateSubscriberDto {
  @ApiProperty()
  campaignId: number;

  @ApiProperty()
  optIn: boolean;
}
