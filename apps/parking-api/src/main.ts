import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]): BadRequestException => {
        const firstError: ValidationError | undefined = errors.find(
          (err: ValidationError): boolean | undefined =>
            err.constraints && Object.keys(err.constraints).length > 0,
        );
        const firstMessage: string = firstError?.constraints
          ? Object.values(firstError.constraints)[0]
          : 'Validation error';

        return new BadRequestException(firstMessage);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
