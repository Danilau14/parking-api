import { Module } from '@nestjs/common';
import { ParkingHistoryService } from './service/parking-history.service';
import { ParkingHistoryController } from './controller/parking-history.controller';
import { ParkingHistory } from './entities/parking-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { ParkingLotsModule } from '../parking-lots/parking-lots.module';
import { ParkingHistoryRepository } from './repository/parking-history.repository';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParkingHistory]),
    VehiclesModule,
    ParkingLotsModule,
    HttpModule,
    UsersModule,
  ],
  controllers: [ParkingHistoryController],
  providers: [ParkingHistoryService, ParkingHistoryRepository],
  exports: [ParkingHistoryRepository],
})
export class ParkingHistoryModule {}
