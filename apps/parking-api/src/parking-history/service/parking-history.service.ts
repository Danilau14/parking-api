import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParkingHistoryDto } from '../dto/create-parking-history.dto';
import { UpdateParkingHistoryDto } from '../dto/update-parking-history.dto';
import { VehiclesRepository } from '../../vehicles/repository/vehicles.repository';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ParkingHistoryRepository } from '../repository/parking-history.repository';
import { ParkingLot } from '../../parking-lots/entities/parking-lot.entity';
import { ParkingLotsRepository } from '../../parking-lots/repository/parking-lots.repository';
import { CreateVehicleDto } from '../../vehicles/dto/create-vehicle.dto';
import { ParkingHistory } from '../entities/parking-history.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { User, UserRole } from '../../users/entities/user.entity';
import { EmailNotificationService } from '../../users/service/email-notification.service';

@Injectable()
export class ParkingHistoryService {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    private readonly parkingHistoryRepository: ParkingHistoryRepository,
    private readonly parkingLotsRepository: ParkingLotsRepository,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  private async findVehicleAndParkingLot(
    createParkingHistoryDto: CreateParkingHistoryDto,
  ): Promise<{ vehicle: Vehicle | null; parkingLot: ParkingLot }> {
    const parkingLot: ParkingLot | null =
      await this.parkingLotsRepository.findOneById(
        createParkingHistoryDto.parkingLotId,
      );

    if (!parkingLot) throw new NotFoundException('ParkingLot not found');

    const vehicle: Vehicle | null =
      await this.vehiclesRepository.findOneVehicleByLicencePlate(
        createParkingHistoryDto.licensePlate,
      );

    return { vehicle, parkingLot };
  }

  async createParkingHistory(
    createParkingHistoryDto: CreateParkingHistoryDto,
  ): Promise<ParkingHistory> {
    const { vehicle, parkingLot } = await this.findVehicleAndParkingLot(
      createParkingHistoryDto,
    );

    if (!vehicle) {
      return await this.createParkingHistoryForNewVehicle(
        createParkingHistoryDto,
        parkingLot,
      );
    }

    if (vehicle.isParked) {
      throw new BadRequestException(
        'Unable to Register Entry, the license plate already exists in this or another parking lot.',
      );
    }

    const newParkingHistory: ParkingHistory =
      await this.createParkingHistoryForExistingVehicle(vehicle, parkingLot);

    if (parkingLot.user) {
      await this.emailNotificationService.sendEmailNotificationCreateRegister({
        email: parkingLot.user.email,
        licensePlate: vehicle.licensePlate,
        message: 'A new vehicle has entered the parking lot.',
        parkingLotId: parkingLot.id,
      });
    }

    return newParkingHistory;
  }

  private async createParkingHistoryForNewVehicle(
    createParkingHistoryDto: CreateParkingHistoryDto,
    parkingLot: ParkingLot,
  ): Promise<ParkingHistory> {
    if (parkingLot.freeSpaces == 0) {
      throw new BadRequestException('Parking lot full');
    }

    const newVehicle: CreateVehicleDto = {
      licensePlate: createParkingHistoryDto.licensePlate,
      recycleBin: false,
      isParked: true,
    };

    const vehicle: Vehicle = await this.vehiclesRepository.create(newVehicle);

    parkingLot.freeSpaces -= 1;

    const updatedParkingLot: ParkingLot =
      await this.parkingLotsRepository.update(parkingLot);

    const newParkingHistory: Partial<ParkingHistory> = {
      vehicle: vehicle,
      parkingLot: updatedParkingLot,
    };

    return await this.parkingHistoryRepository.create(newParkingHistory);
  }

  private async createParkingHistoryForExistingVehicle(
    vehicle: Vehicle,
    parkingLot: ParkingLot,
  ): Promise<ParkingHistory> {
    const parkingHistoryOpen: ParkingHistory | null =
      await this.parkingHistoryRepository.findOneParkingHistoryOpen(
        vehicle.id,
        parkingLot.id,
      );

    if (parkingHistoryOpen === null && vehicle.isParked) {
      throw new BadRequestException('Vehicle in other Parking lot');
    }

    if (parkingLot.freeSpaces === 0) {
      throw new BadRequestException('Parking lot full');
    }

    const updatedVehicle = await this.vehiclesRepository.update({
      ...vehicle,
      isParked: true,
    });

    parkingLot.freeSpaces -= 1;

    const updatedParkingLot: ParkingLot =
      await this.parkingLotsRepository.update(parkingLot);

    const newParkingHistory: Partial<ParkingHistory> = {
      vehicle: updatedVehicle,
      parkingLot: updatedParkingLot,
    };

    return await this.parkingHistoryRepository.create(newParkingHistory);
  }

  async closeParkingHistory(
    createParkingHistoryDto: CreateParkingHistoryDto,
  ): Promise<ParkingHistory> {
    const { vehicle, parkingLot } = await this.findVehicleAndParkingLot(
      createParkingHistoryDto,
    );

    if (!vehicle) {
      throw new BadRequestException('Vehicle not Found');
    }

    const parkingHistoryOpen: ParkingHistory | null =
      await this.parkingHistoryRepository.findOneParkingHistoryOpen(
        vehicle.id,
        parkingLot.id,
      );

    if (parkingHistoryOpen === null && vehicle.isParked) {
      throw new BadRequestException(
        'Unable to Register Entry, the license plate already exists in this or another parking lot.',
      );
    }

    if (parkingHistoryOpen === null && !vehicle.isParked) {
      throw new BadRequestException(
        'Unable to Check Out, there is no license plate in the parking lot.',
      );
    }

    const parkingHistoryUpdate: ParkingHistory =
      await this.parkingHistoryRepository.updateTimeInParkingLot({
        ...parkingHistoryOpen,
        checkOutDate: new Date(),
      });

    await this.vehiclesRepository.update({
      ...vehicle,
      isParked: false,
    });

    await this.parkingLotsRepository.update({
      ...parkingLot,
      freeSpaces: (parkingLot.freeSpaces += 1),
    });

    return parkingHistoryUpdate;
  }

  async findVehiclesWithParkingLot(
    paginationDto: PaginationDto,
    parkingLotId: number | null = null,
    user: User | null = null,
  ) {
    if (parkingLotId && user?.role === UserRole.PARTNER) {
      const parkingLot: ParkingLot | null =
        await this.parkingLotsRepository.findByParkingLotAndUser(
          parkingLotId,
          user,
        );
      if (!parkingLot) {
        throw new BadRequestException(
          'The parkingLot does not have this associated partner',
        );
      }
    }
    const { page, limit } = paginationDto;

    const [data, total] =
      await this.parkingHistoryRepository.findVehiclesByParkingLot(
        page,
        limit,
        parkingLotId,
      );

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
