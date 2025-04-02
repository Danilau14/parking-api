import { Controller } from '@nestjs/common';
import { VehiclesService } from '../service/vehicles.service';


@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}
}
