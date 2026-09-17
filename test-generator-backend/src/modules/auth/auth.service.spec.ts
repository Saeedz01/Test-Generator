import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService password reset', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mailerService = { sendMail: jest.fn() };
  const configService = {
    getOrThrow: jest.fn(),
    get: jest.fn(),
  };
  const jwtService = { signAsync: jest.fn(), verifyAsync: jest.fn() };
  const userService = {};

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prisma as never,
      jwtService as never,
      configService as never,
      mailerService as never,
      userService as never,
    );
  });

  it('stores reset OTP separately and does not touch login otp', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@test.com',
      name: 'A',
    });
    prisma.user.update.mockResolvedValue({});
    mailerService.sendMail.mockResolvedValue(undefined);

    await service.forgotPassword({ email: 'a@test.com' });

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          resetOtp: expect.any(String),
          resetOtpExpiresAt: expect.any(Date),
        }),
      }),
    );
    expect(prisma.user.update.mock.calls[0][0].data.otp).toBeUndefined();
  });

  it('revokes refresh token after confirmResetPassword', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bcrypt = require('bcrypt') as typeof import('bcrypt');
    const tokenHash = await bcrypt.hash('12345678', 4);
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      resetOtp: tokenHash,
      resetOtpExpiresAt: new Date(Date.now() + 60_000),
    });
    prisma.user.update.mockResolvedValue({});

    await service.confirmResetPassword({
      email: 'a@test.com',
      token: '12345678',
      newPassword: 'new-password-123',
    });

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          refreshTokenHash: null,
          resetOtp: null,
          resetOtpExpiresAt: null,
        }),
      }),
    );
  });

  it('rejects invalid reset token', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      resetOtp: null,
      resetOtpExpiresAt: null,
    });

    await expect(
      service.confirmResetPassword({
        email: 'a@test.com',
        token: 'bad',
        newPassword: 'new-password-123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
