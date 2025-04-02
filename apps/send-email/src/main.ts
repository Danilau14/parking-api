import { NestFactory } from '@nestjs/core';
import { SendEmailModule } from './send-email.module';

async function bootstrap() {
  const app = await NestFactory.create(SendEmailModule);
  await app.listen(process.env.port ?? 4000);
}
bootstrap();
