import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ParkingHistory } from '../../parking-history/entities/parking-history.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Check('"costPerHour" > 0')
@Check('"size" > 0')
export class ParkingLot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'int' })
  size: number;

  @Column({ nullable: false, type: 'float' })
  costPerHour: number;

  @Column({ default: false })
  recycleBin: boolean;

  @OneToMany(
    (): typeof ParkingHistory => ParkingHistory,
    (parkingHistory: ParkingHistory): ParkingLot => parkingHistory.parkingLot,
  )
  parkingHistories: ParkingHistory[];

  @ManyToOne(
    (): typeof User => User,
    (user: User): ParkingLot => user.parkingLot,
  )
  @JoinColumn()
  user: User | null;
}
