import { AuthSeedService } from './auth.seed.service';

describe('AuthSeedService', () => {
  const userService = {
    ensureRole: jest.fn(),
    createSuperAdminIfMissing: jest.fn(),
    createWithRole: jest.fn(),
  };
  const originalEnv = { ...process.env };
  let service: AuthSeedService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'development',
      AUTH_SEED: 'true',
    };
    delete process.env.AUTH_SEED_SUPER_ADMIN_EMAIL;
    delete process.env.AUTH_SEED_SUPER_ADMIN_PASSWORD;
    delete process.env.AUTH_SEED_ADMIN_EMAIL;
    delete process.env.AUTH_SEED_PASSWORD;
    service = new AuthSeedService(userService as never);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('skips (without throwing) when the super admin email is not configured', async () => {
    process.env.AUTH_SEED_SUPER_ADMIN_PASSWORD = 'a-very-long-password';
    await expect(service.onModuleInit()).resolves.toBeUndefined();
    expect(userService.createSuperAdminIfMissing).not.toHaveBeenCalled();
  });

  it('skips when the seed password is shorter than 12 characters', async () => {
    process.env.AUTH_SEED_SUPER_ADMIN_EMAIL = 'root@example.com';
    process.env.AUTH_SEED_SUPER_ADMIN_PASSWORD = 'short';
    await service.onModuleInit();
    expect(userService.createSuperAdminIfMissing).not.toHaveBeenCalled();
  });

  it('creates the super admin only via the create-only helper', async () => {
    process.env.AUTH_SEED_SUPER_ADMIN_EMAIL = 'root@example.com';
    process.env.AUTH_SEED_SUPER_ADMIN_PASSWORD = 'a-very-long-password';
    userService.createSuperAdminIfMissing.mockResolvedValue({ created: false });
    await service.onModuleInit();
    expect(userService.createSuperAdminIfMissing).toHaveBeenCalledWith(
      'root@example.com',
      'a-very-long-password',
      'Super Admin',
    );
  });

  it('never seeds users in production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.AUTH_SEED_SUPER_ADMIN_EMAIL = 'root@example.com';
    process.env.AUTH_SEED_SUPER_ADMIN_PASSWORD = 'a-very-long-password';
    await service.onModuleInit();
    expect(userService.ensureRole).toHaveBeenCalledTimes(2);
    expect(userService.createSuperAdminIfMissing).not.toHaveBeenCalled();
  });
});
