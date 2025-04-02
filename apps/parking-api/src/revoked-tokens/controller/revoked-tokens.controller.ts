import { Controller } from '@nestjs/common';
import { RevokedTokensService } from '../service/revoked-tokens.service';

@Controller('revoked-tokens')
export class RevokedTokensController {
  constructor(private readonly revokedTokensService: RevokedTokensService) {}
}
