import { Module } from '@nestjs/common';
import { SendEmailController } from './send-email.controller';
import { SendEmailService } from './send-email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [],
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class SendEmailModule {}
