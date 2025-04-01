import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

  @Post('register-entry')
  createParkingHistory(
    @Body() createParkingHistoryDto: CreateParkingHistoryDto,
  ): ParkingHistoryDto {
    const parkingHistory: Promise<ParkingHistory> =
      this.parkingHistoryService.createParkingHistory(createParkingHistoryDto);
    return plainToInstance(ParkingHistoryDto, parkingHistory);
  }

  @Patch('register-departure')
  async closeParkingHistory(
    @Body() createParkingHistoryDto: CreateParkingHistoryDto,
  ): Promise<ParkingHistoryDto> {
    const parkingHistory: ParkingHistory =
      await this.parkingHistoryService.closeParkingHistory(
        createParkingHistoryDto,
      );
    return plainToInstance(ParkingHistoryDto, parkingHistory);
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
