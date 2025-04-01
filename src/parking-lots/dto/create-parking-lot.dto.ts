import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { IsGreaterThanZero } from '../validator/is-greater-than-zero.validator';

export class CreateParkingLotDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'The size must be greater than 0' })
  size: number;

  @IsNotEmpty()
  @IsNumber()
  @IsGreaterThanZero({ message: 'The costPerHour must be greater than 0' })
  costPerHour: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Invalid PartnerId' })
  partnerId?: number;
}
