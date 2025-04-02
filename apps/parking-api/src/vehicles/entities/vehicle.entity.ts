import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ParkingHistory } from '../../parking-history/entities/parking-history.entity';

@Entity()
@Unique(['licensePlate'])
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'text',
    transformer: {
      to: (value: string) => value?.toUpperCase(),
      from: (value: string) => value,
    },
  })
  licensePlate: string;

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
