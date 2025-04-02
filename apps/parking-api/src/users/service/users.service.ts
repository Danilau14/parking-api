import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../entities/user.entity';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User | null = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (user) throw new BadRequestException('Email already exists');

    const hashedPassword: string = await hash(createUserDto.password, 10);

    const newUser: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.usersRepository.create(newUser);
  }
}
