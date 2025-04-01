import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../../jwt/interface/jwt-payload.interfaces';
import { User } from '../../users/entities/user.entity';
import { UsersRepository } from '../../users/repository/users.repository';
import { IS_PUBLIC_KEY } from '../../common/decorators/is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
    private readonly usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('Missing  token');

    if (!this.extractTokenFromHeader(request))
      throw new UnauthorizedException('Token not provided');
    try {
      const jwtDecode: JwtPayload = await this.jwtService.verifyAsync(
        authHeader.split(' ')[1],
        {
          secret: this.configService.get('config.jwtSecret'),
        },
      );

      const user: User | null = await this.usersRepository.findByEmail(
        jwtDecode.email,
      );

      if (user) request['user'] = user;

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid token';
      throw new UnauthorizedException(errorMessage);
    }
  }
  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
