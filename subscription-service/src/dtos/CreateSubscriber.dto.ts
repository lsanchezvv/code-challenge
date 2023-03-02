import { IsEmail, IsString, IsOptional, IsDateString } from 'class-validator';
import { GenderEnum } from '../common/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriberDto {
  @IsEmail()
  @ApiProperty({
    description: 'Subscribers email',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Subscribers first name',
  })
  firstName: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Subscribers gender',
    enum: ['male', 'female', 'other_non_binary', 'not_disclosed'],
  })
  gender: GenderEnum;

  @IsDateString()
  @ApiProperty()
  dateOfBirth: Date;
}
