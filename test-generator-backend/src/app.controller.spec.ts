import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]) };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return ok when database responds', async () => {
      await expect(appController.health()).resolves.toEqual({
        ok: true,
        database: 'up',
      });
      expect(prisma.$queryRaw).toHaveBeenCalled();
    });
  });
});
