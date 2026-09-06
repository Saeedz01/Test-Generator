import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../../modules/user/entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from './roles.decorator';

/** JWT + admin/super_admin for mutating staff routes. */
export function AdminOnly() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.SUPER_ADMIN),
  );
}
