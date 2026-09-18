import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Role } from '../user/entities/user.entity';

const MIN_SEED_PASSWORD_LENGTH = 12;
const EMAIL_RE = /^[^\s@]+@[^\s@]+$/;

/**
 * Ensures the role rows exist and, in development only (AUTH_SEED=true),
 * creates missing seed accounts. Seeding is create-only: it never deletes
 * other super admins, never resets an existing password and never revokes
 * existing sessions. Missing/invalid seed config only logs a warning.
 */
@Injectable()
export class AuthSeedService implements OnModuleInit {
  private readonly logger = new Logger(AuthSeedService.name);

  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    await this.seedRolesAndUsers();
  }

  private async seedRolesAndUsers() {
    await this.userService.ensureRole(Role.SUPER_ADMIN);
    await this.userService.ensureRole(Role.ADMIN);

    if (process.env.NODE_ENV === 'production') {
      this.logger.log('Auth user seed skipped in production');
      return;
    }

    if (process.env.AUTH_SEED !== 'true') {
      this.logger.log('Auth user seed skipped (set AUTH_SEED=true to enable)');
      return;
    }

    await this.seedSuperAdmin();
    await this.seedAdmin();
  }

  private readSeedCredentials(
    label: string,
    emailKey: string,
    passwordKey: string,
  ): { email: string; password: string } | null {
    const email = process.env[emailKey]?.trim() ?? '';
    const password = process.env[passwordKey]?.trim() ?? '';

    if (!EMAIL_RE.test(email)) {
      this.logger.warn(
        `${label} seed skipped: set ${emailKey} to a valid email`,
      );
      return null;
    }
    if (password.length < MIN_SEED_PASSWORD_LENGTH) {
      this.logger.warn(
        `${label} seed skipped: ${passwordKey} must be at least ${MIN_SEED_PASSWORD_LENGTH} characters`,
      );
      return null;
    }
    return { email, password };
  }

  private async seedSuperAdmin() {
    const credentials = this.readSeedCredentials(
      'Super admin',
      'AUTH_SEED_SUPER_ADMIN_EMAIL',
      'AUTH_SEED_SUPER_ADMIN_PASSWORD',
    );
    if (!credentials) {
      return;
    }

    try {
      const { created } = await this.userService.createSuperAdminIfMissing(
        credentials.email,
        credentials.password,
        'Super Admin',
      );
      this.logger.log(
        created
          ? `Seeded ${Role.SUPER_ADMIN}: ${credentials.email}`
          : `Seed skipped (exists, left unchanged): ${credentials.email}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to seed super admin: ${message}`);
    }
  }

  private async seedAdmin() {
    const credentials = this.readSeedCredentials(
      'Admin',
      'AUTH_SEED_ADMIN_EMAIL',
      'AUTH_SEED_PASSWORD',
    );
    if (!credentials) {
      return;
    }

    try {
      await this.userService.createWithRole(
        credentials.email,
        credentials.password,
        Role.ADMIN,
        'Admin',
      );
      this.logger.log(`Seeded ${Role.ADMIN}: ${credentials.email}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('already exists')) {
        this.logger.log(`Seed skipped (exists): ${credentials.email}`);
        return;
      }
      this.logger.error(`Failed to seed ${credentials.email}: ${message}`);
    }
  }
}
