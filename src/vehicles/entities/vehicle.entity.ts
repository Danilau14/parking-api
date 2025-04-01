import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ParkingHistory } from '../../parking-history/entities/parking-history.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licencePlate: string;

  @Column({ default: false })
  isParked: boolean;

  @Column({ default: false })
  recycleBin: boolean;

  @OneToMany(
    (): typeof ParkingHistory => ParkingHistory,
    (parkingHistory: ParkingHistory): Vehicle => parkingHistory.vehicle,
  )
  parkingHistories: ParkingHistory[];
}
