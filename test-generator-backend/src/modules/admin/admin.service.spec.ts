import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AdminService', () => {
  let service: AdminService;
  const prisma = {
    schoolClass: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects a class whose code is already taken', async () => {
    prisma.schoolClass.findFirst
      .mockResolvedValueOnce(null) // name is free
      .mockResolvedValueOnce({ id: 'c1', code: '9th' }); // code is taken

    await expect(
      service.createClass({ name: 'Ninth', code: '9th' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.schoolClass.create).not.toHaveBeenCalled();
  });
});
