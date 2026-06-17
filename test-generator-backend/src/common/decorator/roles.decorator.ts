import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// here key value(as ROLES_KEY) in setMetadata should in string form, not a symbol
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
