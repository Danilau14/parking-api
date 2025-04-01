import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParkingLotDto } from '../dto/create-parking-lot.dto';
import { ParkingLotsRepository } from '../repository/parking-lots.repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { User } from '../../users/entities/user.entity';
import { ParkingLotDto } from '../dto/parking-lot.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ParkingLot } from '../entities/parking-lot.entity';

@Injectable()
export class ParkingLotsService {
  constructor(
    private readonly parkingLotsRepository: ParkingLotsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createParkingLot(
    createParkingLotDto: CreateParkingLotDto,
  ): Promise<ParkingLot> {
    if (createParkingLotDto.partnerId === undefined) {
      const newParkingLot: Partial<ParkingLotDto> = {
        size: createParkingLotDto.size,
        freeSpaces: createParkingLotDto.size,
        costPerHour: createParkingLotDto.costPerHour,
      };

      return this.parkingLotsRepository.create(newParkingLot);
    }

    const partnerExist: User | null =
      await this.usersRepository.findOnePartnerById(
        createParkingLotDto.partnerId,
      );

    if (!partnerExist) throw new NotFoundException('Invalid partner id');

    const newParkingLot: Partial<ParkingLotDto> = {
      size: createParkingLotDto.size,
      freeSpaces: createParkingLotDto.size,
      costPerHour: createParkingLotDto.costPerHour,
      user: partnerExist,
    };

    return this.parkingLotsRepository.create(newParkingLot);
  }

  async findAllParkingLots(
    paginationDto: PaginationDto,
    user: User | null = null,
  ) {
    const { page, limit } = paginationDto;

    const [data, total] = await this.parkingLotsRepository.findAndCount(
      page,
      limit,
      user?.id,
    );

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findParkingLotById(id: number): Promise<ParkingLot | null> {
    const parkingLot: ParkingLot | null =
      await this.parkingLotsRepository.findOneById(id);

    if (!parkingLot) throw new NotFoundException('ParkingLot not found');

    return parkingLot;
  }

  async update(
    id: number,
    updateParkingLotDto: Partial<ParkingLotDto>,
  ): Promise<ParkingLot> {
    const parkingLotToUpdate: ParkingLot | null =
      await this.parkingLotsRepository.findOneById(id);

    if (!parkingLotToUpdate)
      throw new NotFoundException('ParkingLot not found');

    if (typeof updateParkingLotDto.partnerId === 'number') {
      const partner: User | null =
        await this.usersRepository.findOnePartnerById(
          updateParkingLotDto.partnerId,
        );

      if (!partner) throw new NotFoundException('Invalid partner id');

      parkingLotToUpdate.user = partner;
    }

    if (updateParkingLotDto.size) {
      parkingLotToUpdate.size = updateParkingLotDto.size;
    }

    if (updateParkingLotDto.costPerHour) {
      parkingLotToUpdate.costPerHour = updateParkingLotDto.costPerHour;
    }

    return await this.parkingLotsRepository.update(parkingLotToUpdate);
  }

  async removeParkingLotById(id: number): Promise<ParkingLot> {
    const parkingLotRemoved: ParkingLot | null =
      await this.findParkingLotById(id);

    if (!parkingLotRemoved) throw new NotFoundException('ParkingLot not found');

    parkingLotRemoved.recycleBin = true;

    return await this.parkingLotsRepository.update(parkingLotRemoved);
  }
}
