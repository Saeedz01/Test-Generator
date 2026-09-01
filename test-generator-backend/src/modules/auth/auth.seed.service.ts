import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Role } from '../user/entities/user.entity';

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

    const seedUsers = [
      {
        email: 'superadmin@gmail.com',
        password: '1122',
        role: Role.SUPER_ADMIN,
        name: 'Super Admin',
      },
      {
        email: 'admin@gmail.com',
        password: '1122',
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
