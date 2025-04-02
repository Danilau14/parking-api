import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ParkingHistoryService } from '../service/parking-history.service';
import { CreateParkingHistoryDto } from '../dto/create-parking-history.dto';
import { ParkingHistoryDto } from '../dto/parking-history.dto';
import { plainToInstance } from 'class-transformer';
import { ParkingHistory } from '../entities/parking-history.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ListVehicleParkedDto } from '../dto/list-vehicle-parked.dto';
import { IsPartner } from '../../common/decorators/is-partner.decorator';
import { IsAdmin } from '../../common/decorators/is-admin.decorator';
import { RequestWithUserInterface } from '../../common/interfaces/requets-with-user';
import { UserRole } from '../../users/entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('parking-history')
export class ParkingHistoryController {
  constructor(private readonly parkingHistoryService: ParkingHistoryService) {}

  @Post('check-in')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.PARTNER)
  async createParkingHistory(
    @Body() createParkingHistoryDto: CreateParkingHistoryDto,
  ) {
    const parkingHistory: ParkingHistory =
      await this.parkingHistoryService.createParkingHistory(
        createParkingHistoryDto,
      );
    return {
      id: parkingHistory.id,
    };
  }

  @Patch('check-out')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.PARTNER)
  async closeParkingHistory(
    @Body() createParkingHistoryDto: CreateParkingHistoryDto,
  ): Promise<{ message: string; parkingHistory: ParkingHistoryDto }> {
    const parkingHistory: ParkingHistory =
      await this.parkingHistoryService.closeParkingHistory(
        createParkingHistoryDto,
      );

    return {
      message: 'Check out registered',
      parkingHistory: plainToInstance(ParkingHistoryDto, parkingHistory)
    };
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, total, page, totalPages } =
      await this.parkingHistoryService.findVehiclesWithParkingLot(
        paginationDto,
        Number(paginationDto.q),
      );
    return {
      data: plainToInstance(ListVehicleParkedDto, data),
      total,
      page,
      totalPages,
    };
  }

  @Get('all-by-partner')
  @Roles(UserRole.PARTNER)
  async findAllByPartner(
    @Query() paginationDto: PaginationDto,
    @Req() req: RequestWithUserInterface,
  ) {
    const { data, total, page, totalPages } =
      await this.parkingHistoryService.findVehiclesWithParkingLot(
        paginationDto,
        Number(paginationDto.q),
        req.user,
      );
    return {
      data: plainToInstance(ListVehicleParkedDto, data),
      total,
      page,
      totalPages,
    };
  }
}
