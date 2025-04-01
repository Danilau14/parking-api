import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('database', () => ({
  username: process.env.PSQL_USERNAME,
  password: process.env.PSQL_PASSWORD,
  host: process.env.PSQL_HOST,
  port: process.env.PSQL_PORT,
  database: process.env.PSQL_DATABASE,
}));
