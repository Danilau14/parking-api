import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { IsPublic } from '../../common/decorators/is-public.decorator';
import { RevokedTokensService } from '../../revoked-tokens/service/revoked-tokens.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly revokedTokensService: RevokedTokensService,
  ) {}

  @Post('login')
  @IsPublic()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    await this.revokedTokensService.revokeToken(token);

    return { message: 'Logged out successfully' };
  }
}
