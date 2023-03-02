import { GenderEnum } from '../common/types.common';

export class CreateSubscribscriptionDto {
  email: string;
  firstName: string | null;
  gender: GenderEnum;
  dateOfBirth: Date;
  campaignId: number;
  optIn: boolean;
}
