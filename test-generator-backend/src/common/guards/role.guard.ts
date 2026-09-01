import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // it fetch the roles from the decorator(Roles) that are registered in metadata(setMetadata) by the decorator(Roles)
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    
    if (!user?.role) {
      throw new ForbiddenException(ERROR_MESSAGES.PERMISSION_DENIED);
    }

    const effectiveRoles =
      user.role === 'super_admin' ? ['super_admin', 'admin'] : [user.role];

    if (!requiredRoles.some((role) => effectiveRoles.includes(role))) {
      throw new ForbiddenException(ERROR_MESSAGES.PERMISSION_DENIED);
    }

    return true;
  }
}
