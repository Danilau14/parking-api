import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUserInterface } from '../../common/interfaces/requets-with-user';
import { UserRole } from '../entities/user.entity';
import { IS_ADMIN_KEY } from '../../common/decorators/is-admin.decorator';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isAdmin) return true;

    const request: RequestWithUserInterface = context
      .switchToHttp()
      .getRequest();

    if (request.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not admin');
    }

    return true;
  }
}