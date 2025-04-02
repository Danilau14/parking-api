import { Injectable } from '@nestjs/common';

@Injectable()
export class SendEmailService {
  getHello(): string {
    return 'Hello World!';
  }
}
