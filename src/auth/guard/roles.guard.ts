import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { RequestWithUserInterface } from '../../common/interfaces/requets-with-user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request: RequestWithUserInterface = context
      .switchToHttp()
      .getRequest();

    const hasRole: boolean = requiredRoles.some((role: UserRole): boolean =>
      request.user.role?.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `You do not have the required roles to access this resource. Required roles: ${requiredRoles[0]}`,
      );
    }

    return true;
  }
}
