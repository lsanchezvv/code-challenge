import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { UserAccessToken } from '../common/types.common';

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<UserAccessToken | undefined> {
    const authServiceBaseUrl = this.configService.get('AUTH_SERVICE_BASE_URL');

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${authServiceBaseUrl}/auth/login`, {
          username,
          password,
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response.status === 401) {
              throw new UnauthorizedException();
            }
            throw error;
          }),
        ),
    );

    return data;
  }
}
