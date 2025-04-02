import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TimePeriod } from '../enums/time-period.enum';
import { Transform, TransformFnParams } from 'class-transformer';

export class TimePeriodDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(TimePeriod)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.toLowerCase().trim() : '',
  )
  period: string;
}
