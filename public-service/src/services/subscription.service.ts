import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateSubscribscriptionDto } from 'src/dtos/CreateSubscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(SubscriptionService.name);

  async getSubscriptions(token: string) {
    const url = this.configService.get<string>('SUBSCRIPTION_SERVICE_BASE_URL');
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${url}/subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response.status === 404) {
              throw new NotFoundException();
            }

            throw 'An error ocurred';
          }),
        ),
    );
    return data;
  }

  async createSubscription(createSubscriptionDto: CreateSubscribscriptionDto) {
    const url = this.configService.get<string>('SUBSCRIPTION_SERVICE_BASE_URL');
    const { data } = await firstValueFrom(
      this.httpService.post(`${url}/subscriptions`, createSubscriptionDto).pipe(
        catchError((error: AxiosError) => {
          this.logger.error('error', error.message);

          if (error.response.status === 404) {
            throw new NotFoundException();
          }

          if (error.response.status === 409) {
            throw new ConflictException('Subscription already exists');
          }
          throw error;
        }),
      ),
    );

    return data;
  }

  async getSubscription(id: string, token: string) {
    const url = this.configService.get<string>('SUBSCRIPTION_SERVICE_BASE_URL');

    const { data } = await firstValueFrom(
      this.httpService
        .get(`${url}/subscriptions/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error('An error ocurred here', error);

            if (error.response.status === 404) {
              throw new NotFoundException();
            }
            throw error;
          }),
        ),
    );
    return data;
  }

  async cancelSubscription(id: string, token: string) {
    const url = this.configService.get<string>('SUBSCRIPTION_SERVICE_BASE_URL');
    const { data } = await firstValueFrom(
      this.httpService
        .patch(
          `${url}/subscriptions/${id}/cancel`,
          { optIn: false },
          {
            headers: {
              Authorization: token,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(
              error.response.status,
              error.message,
              error.response.data,
            );

            if (error.response.status === 404) {
              throw new NotFoundException();
            }

            if (error.response.status === 401)
              throw new UnauthorizedException();

            throw error;
          }),
        ),
    );
    return data;
  }
}
