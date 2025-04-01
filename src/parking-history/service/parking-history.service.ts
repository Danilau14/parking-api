import { Injectable } from '@nestjs/common';
import { CreateParkingHistoryDto } from '../dto/create-parking-history.dto';
import { UpdateParkingHistoryDto } from '../dto/update-parking-history.dto';

@Injectable()
export class ParkingHistoryService {
  create(createParkingHistoryDto: CreateParkingHistoryDto) {
    return 'This action adds a new parkingHistory';
  }

  findAll() {
    return `This action returns all parkingHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parkingHistory`;
  }

  update(id: number, updateParkingHistoryDto: UpdateParkingHistoryDto) {
    return `This action updates a #${id} parkingHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} parkingHistory`;
  }
}
