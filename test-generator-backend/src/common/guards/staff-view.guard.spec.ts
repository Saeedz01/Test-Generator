import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { StaffViewGuard } from './staff-view.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

function contextFor(req: Record<string, unknown>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

describe('StaffViewGuard', () => {
  let jwtSpy: jest.SpyInstance;

  beforeEach(() => {
    jwtSpy = jest.spyOn(JwtAuthGuard.prototype, 'canActivate');
  });

  afterEach(() => jwtSpy.mockRestore());

  it('lets public requests through without authenticating', async () => {
    const guard = new StaffViewGuard();
    await expect(guard.canActivate(contextFor({ query: {} }))).resolves.toBe(
      true,
    );
    expect(jwtSpy).not.toHaveBeenCalled();
  });

  it('requires a session for includeArchived=true', async () => {
    jwtSpy.mockRejectedValue(new Error('unauthorized'));
    const guard = new StaffViewGuard();
    await expect(
      guard.canActivate(contextFor({ query: { includeArchived: 'true' } })),
    ).rejects.toThrow('unauthorized');
  });

  it('rejects signed-in non-staff users', async () => {
    jwtSpy.mockResolvedValue(true);
    const guard = new StaffViewGuard();
    await expect(
      guard.canActivate(
        contextFor({
          query: { includeArchived: 'true' },
          user: { role: 'teacher' },
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows admins to see archived content', async () => {
    jwtSpy.mockResolvedValue(true);
    const guard = new StaffViewGuard();
    await expect(
      guard.canActivate(
        contextFor({
          query: { includeArchived: 'true' },
          user: { role: 'admin' },
        }),
      ),
    ).resolves.toBe(true);
  });
});
