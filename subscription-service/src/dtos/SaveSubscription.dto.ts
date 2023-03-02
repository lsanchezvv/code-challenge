import { Campaign } from 'src/models/campaign.entity';
import { Subscriber } from 'src/models/subscriber.entity';

export class SaveSubscriptionDto {
  subscriber: Subscriber;
  campaign: Campaign;
  optIn: boolean;
}
