import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('email', () => ({
  hostEmail: process.env.MAIL_HOST,
  portEmail: process.env.MAIL_PORT,
}));
