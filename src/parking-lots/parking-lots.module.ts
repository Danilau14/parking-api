import { Module } from '@nestjs/common';
import { ParkingLotsService } from './service/parking-lots.service';
import { ParkingLotsController } from './controller/parking-lots.controller';
import { ParkingLot } from './entities/parking-lot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLotsRepository } from './repository/parking-lots.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot]), UsersModule],
  controllers: [ParkingLotsController],
  providers: [ParkingLotsService, ParkingLotsRepository],
  exports: [ParkingLotsRepository],
})
export class ParkingLotsModule {}
