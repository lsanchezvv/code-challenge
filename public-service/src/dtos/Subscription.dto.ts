import { Expose, Transform } from 'class-transformer';

export class SubscriptionDto {
  @Expose()
  id: string;

  @Expose()
  optIn: boolean;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => obj.subscriber.firstName)
  firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.campaign.id)
  campaignId: number;

  @Expose()
  @Transform(({ obj }) => obj.campaign.campaignName)
  campaignName: string;
}
