import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ParkingLotsService } from '../service/parking-lots.service';
import { CreateParkingLotDto } from '../dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from '../dto/update-parking-lot.dto';
import { UserGuard } from '../../users/guard/user.guard';
import { IsAdmin } from '../../common/decorators/is-admin.decorator';
import { ParkingLot } from '../entities/parking-lot.entity';
import { plainToInstance } from 'class-transformer';
import { ParkingLotDto } from '../dto/parking-lot.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('parking-lots')
@UseGuards(UserGuard)
@IsAdmin()
export class ParkingLotsController {
  constructor(private readonly parkingLotsService: ParkingLotsService) {}

  @Post()
  async create(
    @Body() createParkingLotDto: CreateParkingLotDto,
  ): Promise<ParkingLotDto> {
    const newParkingLotDto: ParkingLot =
      await this.parkingLotsService.createParkingLot(createParkingLotDto);
    return plainToInstance(ParkingLotDto, newParkingLotDto);
  }

  @Get('all')
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, total, page, totalPages } =
      await this.parkingLotsService.findAllParkingLots(paginationDto);
    return {
      data: plainToInstance(ParkingLotDto, data),
      total,
      page,
      totalPages,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ParkingLotDto | null> {
    const parkingLotDto: ParkingLot | null =
      await this.parkingLotsService.findParkingLotById(id);
    return plainToInstance(ParkingLotDto, parkingLotDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateParkingLotDto: UpdateParkingLotDto,
  ): ParkingLotDto {
    return plainToInstance(
      ParkingLotDto,
      this.parkingLotsService.update(id, updateParkingLotDto),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number): ParkingLotDto {
    return plainToInstance(
      ParkingLotDto,
      this.parkingLotsService.removeParkingLotById(id),
    );
  }
}
