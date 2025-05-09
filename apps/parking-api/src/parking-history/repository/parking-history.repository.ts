import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { ParkingHistory } from '../entities/parking-history.entity';

@Injectable()
export class ParkingHistoryRepository {
  constructor(
    @InjectRepository(ParkingHistory)
    private readonly repository: Repository<ParkingHistory>,
  ) {}

  async create(data: Partial<ParkingHistory>): Promise<ParkingHistory> {
    const parkingHistory: ParkingHistory = this.repository.create(data);
    return this.repository.save(parkingHistory);
  }

  async findOneByVehicleId(vehicleId: number): Promise<ParkingHistory | null> {
    return this.repository.findOne({
      where: { vehicle: { id: vehicleId }, checkOutDate: IsNull() },
      relations: ['vehicle'],
      order: { checkInDate: 'DESC' },
    });
  }

  async findOneParkingHistoryOpen(
    vehicleId: number,
    parkingId: number,
  ): Promise<ParkingHistory | null> {
    return this.repository.findOne({
      where: {
        vehicle: { id: vehicleId },
        parkingLot: { id: parkingId },
        checkOutDate: IsNull(),
      },
      relations: ['vehicle'],
      order: { checkInDate: 'DESC' },
    });
  }

  async update(data: Partial<ParkingHistory>): Promise<ParkingHistory> {
    return this.repository.save(data);
  }

  async updateTimeAndCostInParkingHistory(
  costPerHour: number, 
  data: Partial<ParkingHistory>,
  ): Promise<ParkingHistory> {
    if (data.checkOutDate && data.checkInDate) {
      const timeInMilliseconds: number =
        data.checkOutDate.getTime() - data.checkInDate.getTime();
      const timeInSeconds: number = timeInMilliseconds / 1000;
      const timeInParkingLot: number = Math.floor(timeInSeconds);
      console.log(timeInParkingLot)
      const costTotalParkingLot : number = Math.round(((costPerHour / 3600) * timeInParkingLot) * 100) / 100
      console.log(costTotalParkingLot)
      const dataUpdate = {
        ...data,
        timeInParkingLot,
        costTotalParkingLot
      };
      
      return this.repository.save(dataUpdate);
    }
    throw new BadRequestException('Dates must be different null');
  }

  async findVehiclesByParkingLot(
    page: number,
    limit: number,
    parkingLotId: number | null = null,
  ): Promise<[ParkingHistory[], number]> {
    const queryBuilder: SelectQueryBuilder<ParkingHistory> = this.repository
      .createQueryBuilder('history')
      .innerJoinAndSelect('history.vehicle', 'vehicle')
      .innerJoinAndSelect('history.parkingLot', 'parkingLot')
      .where('history."checkOutDate" IS NULL');

    if (parkingLotId) {
      queryBuilder.andWhere('history."parkingLotId" = :parkingLotId', {
        parkingLotId,
      });
    }

    return await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }
}
