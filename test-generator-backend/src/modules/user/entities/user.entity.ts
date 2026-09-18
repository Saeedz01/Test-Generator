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

  resetOtp?: string | null;

  resetOtpExpiresAt?: Date | null;

  otpFailedAttempts?: number;

  otpLockedUntil?: Date | null;

  resetOtpAttempts?: number;

  isSuspended!: boolean;

  role: UserRole;
}
