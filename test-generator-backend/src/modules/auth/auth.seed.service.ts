import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Role } from '../user/entities/user.entity';

const SUPER_ADMIN_EMAIL = 'saeedzafar4595@gmail.com';
const SUPER_ADMIN_PASSWORD = '1122';
const MIN_SEED_PASSWORD_LENGTH = 12;

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

    try {
      await this.userService.upsertSuperAdmin(
        SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD,
        'Super Admin',
      );
      this.logger.log(`Seeded ${Role.SUPER_ADMIN}: ${SUPER_ADMIN_EMAIL}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to seed super admin: ${message}`);
    }

    const adminPassword = process.env.AUTH_SEED_PASSWORD?.trim() ?? '';
    if (adminPassword.length < MIN_SEED_PASSWORD_LENGTH) {
      this.logger.warn(
        `Admin seed skipped: AUTH_SEED_PASSWORD must be at least ${MIN_SEED_PASSWORD_LENGTH} characters`,
      );
      return;
    }

    const adminEmail = process.env.AUTH_SEED_ADMIN_EMAIL || 'admin@localhost';
    try {
      await this.userService.createWithRole(
        adminEmail,
        adminPassword,
        Role.ADMIN,
        'Admin',
      );
      this.logger.log(`Seeded ${Role.ADMIN}: ${adminEmail}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('already exists')) {
        this.logger.log(`Seed skipped (exists): ${adminEmail}`);
        return;
      }
      this.logger.error(`Failed to seed ${adminEmail}: ${message}`);
    }
  }
}
