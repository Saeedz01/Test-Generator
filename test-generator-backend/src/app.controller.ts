import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @SkipThrottle()
  @Get(['', 'health'])
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { ok: true, database: 'up' };
    } catch {
      throw new HttpException(
        { ok: false, database: 'down' },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
