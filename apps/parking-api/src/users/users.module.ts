import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './repository/users.repository';
import { EmailNotificationService } from './service/email-notification.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, EmailNotificationService, UsersRepository],
  exports: [UsersRepository, EmailNotificationService],
})
export class UsersModule {}
