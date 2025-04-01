import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ParkingHistory } from '../entities/parking-history.entity';

@Injectable()
export class ParkingHistoryRepository {
  constructor(
    @InjectRepository(ParkingHistory)
    private readonly repository: Repository<ParkingHistory>,
  ) {
  }

  async create(data: Partial<ParkingHistory>): Promise<ParkingHistory> {
    const parkingHistory: ParkingHistory = this.repository.create(data);
    return this.repository.save(parkingHistory);
  }

  async findOneByVehicleId(vehicleId: number): Promise<ParkingHistory | null> {
    return this.repository.findOne({
      where: { vehicle: { id: vehicleId }, dateOfDeparture: IsNull() },
      relations: ['vehicle'],
      order: { dateOfEntry: 'DESC' },
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
        dateOfDeparture: IsNull(),
      },
      relations: ['vehicle'],
      order: { dateOfEntry: 'DESC' },
    });
  }

  async update(data: Partial<ParkingHistory>): Promise<ParkingHistory> {
    return this.repository.save(data);
  }

  async updateTimeInParkingLot(
    data: Partial<ParkingHistory>,
  ): Promise<ParkingHistory> {
    if (data.dateOfDeparture && data.dateOfEntry) {
      const timeInMilliseconds: number =
        data.dateOfDeparture.getTime() - data.dateOfEntry.getTime();
      const timeInSeconds: number = timeInMilliseconds / 1000;
      const timeInParkingLot: number = Math.floor(timeInSeconds);
      const dataUpdate = {
        ...data,
        timeInParkingLot,
      };

      return this.repository.save(dataUpdate);
    }
    throw new BadRequestException('Dates must be different null');
  }
}
