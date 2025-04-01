import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParkingHistoryDto } from '../dto/create-parking-history.dto';
import { UpdateParkingHistoryDto } from '../dto/update-parking-history.dto';
import { VehiclesRepository } from '../../vehicles/repository/vehicles.repository';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ParkingHistoryRepository } from '../repository/parking-history.repository';
import { ParkingLot } from '../../parking-lots/entities/parking-lot.entity';
import { ParkingLotsRepository } from '../../parking-lots/repository/parking-lots.repository';
import { CreateVehicleDto } from '../../vehicles/dto/create-vehicle.dto';
import { ParkingHistory } from '../entities/parking-history.entity';

@Injectable()
export class ParkingHistoryService {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    private readonly parkingHistoryRepository: ParkingHistoryRepository,
    private readonly parkingLotsRepository: ParkingLotsRepository,
  ) {}

  async createParkingHistory(createParkingHistoryDto: CreateParkingHistoryDto) {
    const parkingLot: ParkingLot | null =
      await this.parkingLotsRepository.findOneById(
        createParkingHistoryDto.parkingLotId,
      );

    if (!parkingLot) throw new NotFoundException('ParkingLot not found');

    let vehicle: Vehicle | null =
      await this.vehiclesRepository.findOneVehicleByLicencePlate(
        createParkingHistoryDto.licensePlate,
      );

    if (vehicle !== null && vehicle.isParked) {
      const parkingHistoryOpen: ParkingHistory | null =
        await this.parkingHistoryRepository.findOneParkingHistoryOpen(
          vehicle.id,
          parkingLot.id,
        );

      if (parkingHistoryOpen === null && vehicle?.isParked) {
        throw new BadRequestException('Vehicle in other Parking lot');
      }

      if (parkingHistoryOpen) {
        const parkingHistoryUpdate: ParkingHistory =
          await this.parkingHistoryRepository.updateTimeInParkingLot({
            ...parkingHistoryOpen,
            dateOfDeparture: new Date(),
          });

        await this.vehiclesRepository.update({
          ...vehicle,
          isParked: false,
        });

        return parkingHistoryUpdate;
      }
    }
    if (!vehicle) {
      const newVehicle: CreateVehicleDto = {
        licensePlate: createParkingHistoryDto.licensePlate,
        recycleBin: false,
        isParked: true,
      };

      vehicle = await this.vehiclesRepository.create(newVehicle);
    } else {
      vehicle = await this.vehiclesRepository.update({
        ...vehicle,
        isParked: true,
      });
    }
    const newParkingHistory: Partial<ParkingHistory> = {
      vehicle: vehicle,
      parkingLot: parkingLot,
    };

    return await this.parkingHistoryRepository.create(newParkingHistory);
  }

  findAll() {
    return `This action returns all parkingHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parkingHistory`;
  }

  update(id: number, updateParkingHistoryDto: UpdateParkingHistoryDto) {
    return `This action updates a #${id} parkingHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} parkingHistory`;
  }
}
