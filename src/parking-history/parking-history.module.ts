import { Module } from '@nestjs/common';
import { ParkingHistoryService } from './service/parking-history.service';
import { ParkingHistoryController } from './controller/parking-history.controller';
import { ParkingHistory } from './entities/parking-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { ParkingLotsModule } from '../parking-lots/parking-lots.module';
import { ParkingHistoryRepository } from './repository/parking-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParkingHistory]),
    VehiclesModule,
    ParkingLotsModule,
  ],
  controllers: [ParkingHistoryController],
  providers: [ParkingHistoryService, ParkingHistoryRepository],
})
export class ParkingHistoryModule {}
