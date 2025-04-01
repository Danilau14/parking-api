import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('config', () => ({
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpireIn: process.env.JWT_EXPIRE_IN,
}));
