import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  handleEmailNotification(data) {
    console.log('sending notification', data);
    return data;
  }
}
