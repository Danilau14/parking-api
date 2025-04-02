import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.toLowerCase().trim() : '',
  )
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
