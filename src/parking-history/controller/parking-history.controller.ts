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

@Controller('parking-history')
export class ParkingHistoryController {
  constructor(private readonly parkingHistoryService: ParkingHistoryService) {}

  @Post()
  create(@Body() createParkingHistoryDto: CreateParkingHistoryDto) {
    return this.parkingHistoryService.create(createParkingHistoryDto);
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
