import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ParkingLot } from '../../parking-lots/entities/parking-lot.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ParkingHistory } from '../entities/parking-history.entity';

export class ParkingHistoryDto {
  @Exclude()
  vehicle: Vehicle;

  @Exclude()
  parkingLot: ParkingLot;

  @Expose()
  checkInDate: Date;

  @Expose()
  checkOutDate: Date;

  @Expose()
  @Transform(({ obj }: { obj: ParkingHistory }): string | null =>
    obj && obj.vehicle.licensePlate ? obj.vehicle.licensePlate : null,
  )
  licensePlate: string;
}
