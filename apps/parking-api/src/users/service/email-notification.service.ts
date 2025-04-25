import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EmailNotificationService {
  private emailServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const port = this.configService.get<number>('email.portMicroservice');
    const host = this.configService.get<string>('email.hostMicroservice');
    this.emailServiceUrl = `${host}:${port}`;
  }

  async sendEmailNotificationCreateRegister(emailData: {
    email: string;
    licensePlate: string;
    message: string;
    parkingLotId: number;
  }) {
    try {
      await this.httpService.axiosRef.post(`${this.emailServiceUrl}/send-email`, {
        email: emailData.email,
        licensePlate: emailData.licensePlate,
        message: emailData.message,
        parkingLotId: emailData.parkingLotId,
      });
      console.log('Mail sent')
    } catch (AxiosError) {
      console.log('Mail could not be sent')
    }
  }

  async sendEmailNotificationPartner(emailData: {
    email: string;
    message: string;
  }) {
    await this.httpService.axiosRef.post(
      `${this.emailServiceUrl}/send-email-partner`,
      {
        email: emailData.email,
        message: emailData.message,
      },
    );
  }
}
