import { UserRole } from './user.role.entity';

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

export class User {
  id!: string;

  name!: string;

  email!: string;

  password!: string;

  otp?: string | null;

  otpExpiresAt?: Date | null;

  refreshTokenHash?: string | null;

  isSuspended!: boolean;

  // @Column({ type: 'varchar', length: 255 })
  // role!: string;

  role_id: UserRole;
}
