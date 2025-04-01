import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateVehicleDto {
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

  @IsBoolean()
  @IsOptional()
  isParked: boolean = true;

  @IsBoolean()
  @IsOptional()
  recycleBin: boolean = false;
}
