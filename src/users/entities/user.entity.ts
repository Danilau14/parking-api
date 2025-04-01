import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ParkingLot } from '../../parking-lots/entities/parking-lot.entity';

export enum UserRole {
  ADMIN = 'admin',
  PARTNER = 'partner',
}

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PARTNER })
  role: string;

  @Column({ nullable: false, type: 'text' })
  email: string;

  @Column({ nullable: false, type: 'text' })
  password: string;

  @Column({ default: false })
  recycleBin: boolean;

  @OneToMany(
    (): typeof ParkingLot => ParkingLot,
    (parkingLot: ParkingLot): User | null => parkingLot.user,
  )
  parkingLot: ParkingLot;
}
