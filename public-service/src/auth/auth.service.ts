import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.login(username, pass);
    if (user && user.access_token) {
      return user;
    }
    return null;
  }

  async login(token: string | null) {
    return token;
  }
}
