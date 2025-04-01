import { Exclude, Expose, Transform } from 'class-transformer';
import { ParkingHistory } from '../entities/parking-history.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ParkingLot } from '../../parking-lots/entities/parking-lot.entity';

export class ListVehicleParkedDto {
  @Expose()
  id: number;

  @Expose()
  checkInDate: Date;

  @Exclude()
  checkOutDate: Date;

  @Expose()
  @Transform(({ obj }: { obj: ParkingHistory }): string | null =>
    obj && obj.vehicle.licensePlate ? obj.vehicle.licensePlate : null,
  )
  licensePlate: string;

  @Expose()
  @Transform(({ obj }: { obj: ParkingHistory }): number => obj.parkingLot.id)
  parkingLotId: string;

  @Exclude()
  vehicle: Vehicle;

  @Exclude()
  parkingLot: ParkingLot;

  @Exclude()
  recycleBin: boolean;

  @Exclude()
  timeInParkingLot: number;
}
