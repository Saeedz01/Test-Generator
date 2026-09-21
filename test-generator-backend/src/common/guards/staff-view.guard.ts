import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { ERROR_MESSAGES } from '../constant/error-messages';
import { Role } from '../../modules/user/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

const STAFF_ROLES: readonly string[] = [Role.ADMIN, Role.SUPER_ADMIN];

/** `?includeArchived=true` reveals archived content, to staff only. */
export function wantsStaffView(req: Request): boolean {
  return req.query?.includeArchived === 'true';
}

/**
 * Public read routes stay public, but asking for hidden data requires a
 * valid admin session: anonymous callers get 401 and non-staff 403 instead
 * of silently receiving archived content. Requests without the flag skip
 * authentication entirely (no extra DB lookups for public traffic).
 */
@Injectable()
export class StaffViewGuard implements CanActivate {
  private readonly jwtGuard = new JwtAuthGuard();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: { role?: string } }>();
    if (!wantsStaffView(req)) {
      return true;
    }

    await this.jwtGuard.canActivate(context);
    if (!req.user?.role || !STAFF_ROLES.includes(req.user.role)) {
      throw new ForbiddenException(ERROR_MESSAGES.PERMISSION_DENIED);
    }
    return true;
  }
}
