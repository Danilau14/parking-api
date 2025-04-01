import { Module } from '@nestjs/common';
import { ParkingHistoryService } from './service/parking-history.service';
import { ParkingHistoryController } from './controller/parking-history.controller';
import { ParkingHistory } from './entities/parking-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingHistory])],
  controllers: [ParkingHistoryController],
  providers: [ParkingHistoryService],
})
export class ParkingHistoryModule {}
