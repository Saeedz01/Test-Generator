import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Role } from '../user/entities/user.entity';

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

    const password = process.env.AUTH_SEED_PASSWORD?.trim() ?? '';
    if (password.length < MIN_SEED_PASSWORD_LENGTH) {
      this.logger.warn(
        `Auth user seed skipped: AUTH_SEED_PASSWORD must be at least ${MIN_SEED_PASSWORD_LENGTH} characters`,
      );
      return;
    }

    const seedUsers = [
      {
        email: process.env.AUTH_SEED_SUPERADMIN_EMAIL || 'superadmin@localhost',
        password,
        role: Role.SUPER_ADMIN,
        name: 'Super Admin',
      },
      {
        email: process.env.AUTH_SEED_ADMIN_EMAIL || 'admin@localhost',
        password,
        role: Role.ADMIN,
        name: 'Admin',
      },
    ];

    for (const seedUser of seedUsers) {
      try {
        await this.userService.createWithRole(
          seedUser.email,
          seedUser.password,
          seedUser.role,
          seedUser.name,
        );
        this.logger.log(`Seeded ${seedUser.role}: ${seedUser.email}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes('already exists')) {
          this.logger.log(`Seed skipped (exists): ${seedUser.email}`);
          continue;
        }
        this.logger.error(`Failed to seed ${seedUser.email}: ${message}`);
      }
    }
  }
}
