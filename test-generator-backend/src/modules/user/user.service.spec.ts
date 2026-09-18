import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  const prisma = {
    user: {
      findUnique: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userRole: {
      upsert: jest.fn(),
    },
    authSession: {
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('ensureRole upserts by unique role name', async () => {
    prisma.userRole.upsert.mockResolvedValue({ id: 'r1', role_name: 'admin' });
    await service.ensureRole('admin');
    expect(prisma.userRole.upsert).toHaveBeenCalledWith({
      where: { role_name: 'admin' },
      update: {},
      create: { role_name: 'admin' },
    });
  });

  it('refuses to delete the current user', async () => {
    await expect(service.remove('u1', 'u1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.user.deleteMany).not.toHaveBeenCalled();
  });

  it('refuses to delete the last super admin', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u2',
      role: { role_name: Role.SUPER_ADMIN },
    });
    prisma.user.count.mockResolvedValue(1);
    await expect(service.remove('u2', 'u1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.user.deleteMany).not.toHaveBeenCalled();
  });

  it('deletes a super admin when another one remains', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u2',
      role: { role_name: Role.SUPER_ADMIN },
    });
    prisma.user.count.mockResolvedValue(2);
    prisma.user.deleteMany.mockResolvedValue({ count: 1 });
    await expect(service.remove('u2', 'u1')).resolves.toMatchObject({
      affected: 1,
    });
  });

  it('createSuperAdminIfMissing never modifies an existing account', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'root@example.com',
    });
    const result = await service.createSuperAdminIfMissing(
      'root@example.com',
      'a-long-password-123',
    );
    expect(result.created).toBe(false);
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.authSession.updateMany).not.toHaveBeenCalled();
  });

  it('revokes sessions when an admin is suspended', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'a1',
      isSuspended: false,
      role: { role_name: Role.ADMIN },
    });
    prisma.user.update.mockResolvedValue({
      id: 'a1',
      name: 'A',
      email: 'a@example.com',
      isSuspended: true,
      role: { role_name: Role.ADMIN },
    });
    prisma.authSession.updateMany.mockResolvedValue({ count: 2 });

    await service.toggleSuspendAdmin('a1');
    expect(prisma.authSession.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'a1', revokedAt: null },
      }),
    );
  });
});
