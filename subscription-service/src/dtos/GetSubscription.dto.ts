import { IsEmail } from 'class-validator';

export class GetSubscriptionDto {
  @IsEmail()
  username: string;
}
