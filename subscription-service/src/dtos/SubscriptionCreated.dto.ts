import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionCreated {
  @ApiProperty()
  id: number;
}
