import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ParkingLot } from '../entities/parking-lot.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ParkingLotsRepository {
  constructor(
    @InjectRepository(ParkingLot)
    private readonly repository: Repository<ParkingLot>,
  ) {}

  async create(data: Partial<ParkingLot>): Promise<ParkingLot> {
    const parkingLot: ParkingLot = this.repository.create(data);
    return this.repository.save(parkingLot);
  }

  async findAndCount(
    page: number,
    limit: number,
    userId: number | null = null,
  ): Promise<[ParkingLot[], number]> {
    const queryBuilder: SelectQueryBuilder<ParkingLot> =
      this.repository.createQueryBuilder('parkingLot');

    queryBuilder
      .leftJoinAndSelect('parkingLot.user', 'user')
      .select([
        'parkingLot.id',
        'parkingLot.size',
        'parkingLot.costPerHour',
        'user.id',
      ]);

    if (userId !== null) {
      queryBuilder.where('user.id = :userId', { userId });
    }

    return queryBuilder
      .orderBy('parkingLot.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findOneById(id: number): Promise<ParkingLot | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByParkingLotAndUser(
    parkingLotId: number,
    user: User,
  ): Promise<ParkingLot | null> {
    return await this.repository.findOne({
      where: {
        id: parkingLotId,
        user: user,
      },
    });
  }

  update(data: ParkingLot): Promise<ParkingLot> {
    return this.repository.save(data);
  }
}
