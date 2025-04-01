import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingHistoryDto } from './create-parking-history.dto';

export class UpdateParkingHistoryDto extends PartialType(CreateParkingHistoryDto) {}
