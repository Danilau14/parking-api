import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateParkingHistoryDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{3}[0-9]{3}$/, {
    message: 'Invalid format in licence Plate',
  })
  @Length(6, 6, { message: 'Invalid length in licence Plate' })
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.toUpperCase().trim() : '',
  )
  licensePlate: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'ParkingLotId Invalid' })
  parkingLotId: number;
}
