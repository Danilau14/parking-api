import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ParkingLotsService } from '../service/parking-lots.service';
import { CreateParkingLotDto } from '../dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from '../dto/update-parking-lot.dto';
import { ParkingLot } from '../entities/parking-lot.entity';
import { plainToInstance } from 'class-transformer';
import { ParkingLotDto } from '../dto/parking-lot.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequestWithUserInterface } from '../../common/interfaces/requets-with-user';
import { User, UserRole } from '../../users/entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('parking-lots')
export class ParkingLotsController {
  constructor(private readonly parkingLotsService: ParkingLotsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createParkingLotDto: CreateParkingLotDto,
  ): Promise<ParkingLotDto> {
    const newParkingLotDto: ParkingLot =
      await this.parkingLotsService.createParkingLot(createParkingLotDto);
    return plainToInstance(ParkingLotDto, newParkingLotDto);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
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

  @Get('all-by-partner')
  @Roles(UserRole.PARTNER)
  async findAllByPartner(
    @Query() paginationDto: PaginationDto,
    @Req() req: RequestWithUserInterface,
  ) {
    const user: User = req.user;

    const { data, total, page, totalPages } =
      await this.parkingLotsService.findAllParkingLots(paginationDto, user);
    return {
      data: plainToInstance(ParkingLotDto, data),
      total,
      page,
      totalPages,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: number): Promise<ParkingLotDto | null> {
    const parkingLotDto: ParkingLot | null =
      await this.parkingLotsService.findParkingLotById(id);
    return plainToInstance(ParkingLotDto, parkingLotDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number): ParkingLotDto {
    return plainToInstance(
      ParkingLotDto,
      this.parkingLotsService.removeParkingLotById(id),
    );
  }
}
