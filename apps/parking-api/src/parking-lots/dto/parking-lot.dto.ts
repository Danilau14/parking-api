import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { ParkingLot } from '../entities/parking-lot.entity';

export class ParkingLotDto {
  @Expose()
  size: number;

  @Expose()
  freeSpaces: number;

  @Expose()
  costPerHour: number;

  @Expose({ name: 'partnerId' })
  @Transform(({ obj }: { obj: ParkingLot }): number | null =>
    obj && obj.user ? obj.user.id : null,
  )
  partnerId?: number;

  @Exclude()
  user?: User | null;

  @Expose()
  id: number;
}
