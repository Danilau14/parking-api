import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { IndicatorsService } from '../service/indicators.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { TimePeriodDto } from '../dto/time-period.dto';

@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Get('top-registered-vehicles')
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  getTopRegisteredVehicles(
    @Param('parkingLotId') parkingLotId: number | null = null,
  ) {
    return this.indicatorsService.getTop10VehiclesByParkingLot(parkingLotId);
  }

  @Get('top-registered-vehicles/:parkingLotId')
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  getTopRegisteredVehiclesByParkingLot(
    @Param('parkingLotId') parkingLotId: number | null = null,
  ) {
    return this.indicatorsService.getTop10VehiclesByParkingLot(parkingLotId);
  }

  @Get('first-time-parked-vehicles/:parkingLotId')
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  async findFirstTimeParkedVehicles(
    @Param('parkingLotId') parkingLotId: number,
  ) {
    return await this.indicatorsService.findFirstTimeParkedVehicles(
      parkingLotId,
    );
  }

  @Get('earnings/:parkingLotId')
  @Roles(UserRole.PARTNER)
  async getEarnings(
    @Param('parkingLotId') parkingLotId: number,
    @Query() query: TimePeriodDto,
  ) {
    const { period } = query;
    return await this.indicatorsService.getEarningsByPeriod(
      period,
      parkingLotId,
    );
  }

  @Get('top-partners-by-vehicles')
  @Roles(UserRole.ADMIN)
  async getTopPartnersByVehicles() {
    return await this.indicatorsService.getTop3PartnersByWeeklyEntry();
  }

  @Get('top-parking-lots-by-earnings')
  @Roles(UserRole.ADMIN)
  async getTopParkingLotsByEarnings() {
    return await this.indicatorsService.getTop3ParkingLotsByWeeklyEarnings();
  }
}
