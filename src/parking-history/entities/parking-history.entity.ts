import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ParkingLot } from '../../parking-lots/entities/parking-lot.entity';

@Entity()
export class ParkingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  recycleBin: boolean;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateOfEntry: Date;

  @Column({ type: 'timestamptz', nullable: true })
  dateOfDeparture: Date;

  @Column({ nullable: true })
  timeInParkingLot: number;

  @ManyToOne(
    (): typeof Vehicle => Vehicle,
    (vehicle: Vehicle): ParkingHistory[] => vehicle.parkingHistories,
  )
  vehicle: Vehicle;

  @ManyToOne(
    (): typeof ParkingLot => ParkingLot,
    (parkingLot: ParkingLot): ParkingHistory[] => parkingLot.parkingHistories,
  )
  parkingLot: ParkingLot;
}
