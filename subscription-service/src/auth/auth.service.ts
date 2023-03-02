import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from 'src/models/subscriber.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<{ username: string; id: number }> {
    const user = await this.subscriberRepository.findOne({
      where: { email: username },
    });

    if (user && username && pass) {
      const { email, id } = user;
      return { username: email, id };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
