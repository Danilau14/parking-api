import { Injectable } from '@nestjs/common';
import { ParkingHistory } from '../../parking-history/entities/parking-history.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { VehiclesRepository } from '../../vehicles/repository/vehicles.repository';
import { TimePeriod } from '../enums/time-period.enum';

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectRepository(ParkingHistory)
    private readonly parkingHistoryRepository: Repository<ParkingHistory>,

    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<VehiclesRepository>,
  ) {}

  async getTop10VehiclesByParkingLot(
    parkingLotId: number | null = null,
  ): Promise<{ vehicleId: number; timesRegistered: number }[]> {
    const subQuery: SelectQueryBuilder<ParkingHistory> =
      this.parkingHistoryRepository
        .createQueryBuilder('parkingHistory')
        .select('parkingHistory.vehicleId', 'vehicleId')
        .addSelect('COUNT(parkingHistory.id)', 'timesRegistered')
        .groupBy('parkingHistory.vehicleId');

    if (parkingLotId) {
      subQuery.where('parkingHistory.parkingLotId = :parkingLotId', {
        parkingLotId,
      });
    }

    return await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .select('vehicle."licensePlate"', 'vehicle')
      .addSelect('"subQuery"."timesRegistered"', 'timesRegistered')
      .innerJoin(
        `(${subQuery.getQuery()})`,
        'subQuery',
        '"subQuery"."vehicleId" = vehicle.id',
      )
      .setParameters(subQuery.getParameters())
      .orderBy('"subQuery"."timesRegistered"', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async findFirstTimeParkedVehicles(parkingLotId: number) {
    const queryBuilder: SelectQueryBuilder<ParkingHistory> =
      this.parkingHistoryRepository.createQueryBuilder('parkingHistory');

    queryBuilder
      .select('parkingHistory.vehicleId', 'vehicleId')
      .addSelect('COUNT(parkingHistory.vehicleId)', 'timesRegistered')
      .where('parkingHistory.parkingLotId = :parkingLotId', { parkingLotId })
      .groupBy('parkingHistory.vehicleId')
      .having('COUNT(parkingHistory.vehicleId) = 1');

    return queryBuilder.getRawMany();
  }

  async getEarningsByPeriod(period: string, parkingLotId: number) {
    const result = await this.parkingHistoryRepository
      .createQueryBuilder('parkingHistory')
      .leftJoinAndSelect('parkingHistory.parkingLot', 'parkingLot')
      .select(
        '(SUM("parkingHistory"."costTotalParkingLot"))',
        'earnings',
      )
      .where('"parkingHistory"."parkingLotId" = :parkingLotId', {
        parkingLotId,
      })
      .andWhere('"parkingHistory"."timeInParkingLot" IS NOT NULL')
      .andWhere(
        `"parkingHistory"."checkInDate" >= date_trunc(:period, CURRENT_DATE)`,
        { period },
      )
      .getRawOne();

    return result?.earnings || 0;
  }

  async getTop3ParkingLotsByWeeklyEarnings() {
    return await this.parkingHistoryRepository
      .createQueryBuilder('parkingHistory')
      .leftJoinAndSelect('parkingHistory.parkingLot', 'parkingLot')
      .select('parkingHistory.parkingLotId', 'parkingLotId')
      .addSelect(
        '(SUM("parkingHistory"."costTotalParkingLot"))',
        'earnings',
      )
      .where('"parkingHistory"."timeInParkingLot" IS NOT NULL')
      .andWhere(
        `"parkingHistory"."checkInDate" >= date_trunc('week', CURRENT_TIMESTAMP)`,
      )
      .groupBy('parkingHistory.parkingLotId')
      .orderBy('earnings', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async getTop3PartnersByWeeklyEntry() {
    return await this.parkingHistoryRepository
      .createQueryBuilder('parkingHistory')
      .leftJoinAndSelect('parkingHistory.parkingLot', 'parkingLot')
      .select('parkingLot.userId', 'partnerId')
      .addSelect('COUNT("parkingHistory".id)::int', 'vehicles')
      .where(
        `"parkingHistory"."checkInDate" >= date_trunc('week', CURRENT_TIMESTAMP)`,
      )
      .groupBy('parkingLot.userId')
      .orderBy('vehicles', 'DESC')
      .limit(3)
      .getRawMany();
  }
}
