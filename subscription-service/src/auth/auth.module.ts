import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { CustomAuthStrategy } from './custom.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getAuthConfig } from 'src/config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register(getAuthConfig()),
  ],
  providers: [AuthService, CustomAuthStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
