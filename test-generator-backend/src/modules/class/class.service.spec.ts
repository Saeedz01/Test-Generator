import { ConflictException, NotFoundException } from '@nestjs/common';
import { ClassService } from './class.service';

describe('ClassService', () => {
  const prisma = {
    schoolClass: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  let service: ClassService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ClassService(prisma as never);
  });

  it('creates a class', async () => {
    prisma.schoolClass.findFirst.mockResolvedValue(null);
    prisma.schoolClass.create.mockResolvedValue({
      id: '1',
      name: '9th',
      code: '9th',
    });

    await expect(
      service.create({ name: '9th', code: '9th' }),
    ).resolves.toMatchObject({ name: '9th' });
  });

  it('rejects duplicate class names', async () => {
    prisma.schoolClass.findFirst.mockResolvedValue({ id: '1', name: '9th' });
    await expect(service.create({ name: '9th' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('updates a class', async () => {
    prisma.schoolClass.findUnique.mockResolvedValue({
      id: '1',
      name: '9th',
      code: '9th',
    });
    prisma.schoolClass.findFirst.mockResolvedValue(null);
    prisma.schoolClass.update.mockResolvedValue({
      id: '1',
      name: '10th',
      code: '10th',
    });

    await expect(
      service.update('1', { name: '10th', code: '10th' }),
    ).resolves.toMatchObject({ name: '10th' });
  });

  it('archives a class', async () => {
    prisma.schoolClass.findUnique.mockResolvedValue({
      id: '1',
      name: '9th',
      isArchived: false,
    });
    prisma.schoolClass.update.mockResolvedValue({
      id: '1',
      isArchived: true,
    });

    await expect(service.archive('1')).resolves.toMatchObject({
      isArchived: true,
    });
  });

  it('throws when deleting a missing class', async () => {
    prisma.schoolClass.deleteMany.mockResolvedValue({ count: 0 });
    await expect(service.remove('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
