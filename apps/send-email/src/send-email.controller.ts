import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailService } from './send-email.service';

@Controller()
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Post('send-email')
  sendEmail(
    @Body()
    emailData: {
      email: string;
      licensePlate: string;
      message: string;
      parkerLotId: number;
    },
  ) {
    console.log('Request received', emailData);
    return { message: 'mail sent' };
  }

  @Post('send-email-partner')
  sendEmailToPartner(
    @Body()
    emailData: {
      email: string;
      message: string;
    },
  ) {
    console.log('Request received', emailData);
    return { message: 'mail sent' };
  }
}
