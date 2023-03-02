import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [UsersService, HttpModule],
  exports: [UsersService],
})
export class UsersModule {}
