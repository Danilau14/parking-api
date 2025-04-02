import { Module } from '@nestjs/common';
import { VehiclesService } from './service/vehicles.service';
import { VehiclesController } from './controller/vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesRepository } from './repository/vehicles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehiclesController],
  providers: [VehiclesService, VehiclesRepository],
  exports: [VehiclesRepository],
})
export class VehiclesModule {}
