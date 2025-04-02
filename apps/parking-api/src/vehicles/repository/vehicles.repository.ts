import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';

@Injectable()
export class VehiclesRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
  ) {}

  async findOneVehicleByLicencePlate(
    licensePlate: string,
  ): Promise<Vehicle | null> {
    return await this.repository.findOne({
      where: { licensePlate },
    });
  }

  async create(data: CreateVehicleDto): Promise<Vehicle> {
    const vehicle: Vehicle = this.repository.create(data);
    return this.repository.save(vehicle);
  }

  async update(data: Partial<Vehicle>): Promise<Vehicle> {
    return this.repository.save(data);
  }
}
