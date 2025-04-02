import { Module } from '@nestjs/common';
import { IndicatorsService } from './service/indicators.service';
import { IndicatorsController } from './controller/indicators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingHistory } from '../parking-history/entities/parking-history.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingHistory, Vehicle])],
  controllers: [IndicatorsController],
  providers: [IndicatorsService],
})
export class IndicatorsModule {}
