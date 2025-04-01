import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  role: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}
