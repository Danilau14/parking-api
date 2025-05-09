import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { EmailNotificationService } from '../service/email-notification.service';
import { IsPublic } from '../../common/decorators/is-public.decorator';
import { RegisterUserDto } from '../dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  @Post()
  @HttpCode(201)
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.createUser(createUserDto);
    return plainToInstance(UserDto, user);
  }

  @Post('register-partner')
  @HttpCode(201)
  @IsPublic()
  async createPartner(@Body() createUserDto: RegisterUserDto): Promise<UserDto> {
    const user = await this.usersService.createUser(createUserDto);
    return plainToInstance(UserDto, user);
  }

  @Post('send-email-partner')
  @Roles(UserRole.ADMIN)
  async sendEmail(
    @Body()
    emailData: {
      email: string;
      message: string;
    },
  ) {
    try {
      await this.emailNotificationService.sendEmailNotificationPartner(
        emailData,
      );
      return { message: 'Email sent' };
    } catch (error) {
      new Error(error);
    }
  }
}
