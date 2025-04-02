import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { User, UserRole } from '../entities/user.entity';
import { hash } from 'bcryptjs';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(
    createUserDto: CreateUserDto | RegisterUserDto,
  ): Promise<User> {
    const user: User | null = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (user) throw new BadRequestException('Email already exists');

    const hashedPassword: string = await hash(createUserDto.password, 10);

    if ('role' in createUserDto) {
      createUserDto.role = UserRole.PARTNER;
    }

    const newUser: CreateUserDto | RegisterUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.usersRepository.create(newUser);
  }
}
