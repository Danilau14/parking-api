import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ParkingHistoryService } from '../service/parking-history.service';
import { CreateParkingHistoryDto } from '../dto/create-parking-history.dto';
import { UpdateParkingHistoryDto } from '../dto/update-parking-history.dto';
import { ParkingHistoryDto } from '../dto/parking-history.dto';
import { plainToInstance } from 'class-transformer';
import { ParkingHistory } from '../entities/parking-history.entity';

@Controller('parking-history')
export class ParkingHistoryController {
  constructor(private readonly parkingHistoryService: ParkingHistoryService) {}

  @Post()
  createOrUpdateParkingHistory(
    @Body() createParkingHistoryDto: CreateParkingHistoryDto,
  ): ParkingHistoryDto {
    const parkingHistory: Promise<ParkingHistory> =
      this.parkingHistoryService.createAndUpdatedParkingHistory(createParkingHistoryDto);
    return plainToInstance(ParkingHistoryDto, parkingHistory);
  }

  @Post('check-in')
  @HttpCode(HttpStatus.CREATED)
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

  @Get()
  findAll() {
    return this.parkingHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParkingHistoryDto: UpdateParkingHistoryDto) {
    return this.parkingHistoryService.update(+id, updateParkingHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingHistoryService.remove(+id);
  }
}
