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

  async findByLicencePlateIsParked(
    licensePlate: string,
  ): Promise<Vehicle | null> {
    return await this.repository.findOne({
      where: { licensePlate, isParked: true },
    });
  }

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

  async findOneById(id: number | undefined): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findOnePartnerById(id: number | undefined): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { id, recycleBin: false } });
  }
}
