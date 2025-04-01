import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { IsPublic } from '../../common/decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublic()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
