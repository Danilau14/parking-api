import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingLot } from '../entities/parking-lot.entity';

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
  ): Promise<[ParkingLot[], number]> {
    return await this.repository
      .createQueryBuilder('parkingLot')
      .leftJoinAndSelect('parkingLot.user', 'user')
      .select([
        'parkingLot.id',
        'parkingLot.size',
        'parkingLot.costPerHour',
        'user.id',
      ])
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

  update(data: ParkingLot): Promise<ParkingLot> {
    return this.repository.save(data);
  }
}
