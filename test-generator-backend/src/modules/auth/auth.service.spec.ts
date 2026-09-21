import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  AuthService,
  REFRESH_GRACE_MS,
  RESET_CODE_MAX_ATTEMPTS,
  RESET_MAX_FAILED_PER_WINDOW,
  RESET_MAX_REQUESTS_PER_WINDOW,
  RESET_RESEND_COOLDOWN_MS,
  RESET_WINDOW_MS,
} from './auth.service';

const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

const SESSION_ID = '11111111-1111-4111-8111-111111111111';
const USER_ID = '22222222-2222-4222-8222-222222222222';

const config: Record<string, unknown> = {
  'app.jwt.accessSecret': 'a'.repeat(16) + 'bcdefghijklmnopqrstuvwxyz0123456',
  'app.jwt.refreshSecret': 'z'.repeat(16) + 'yxwvutsrqponmlkjihgfedcba6543210',
  'app.jwt.accessExpiresIn': '15m',
  'app.jwt.refreshExpiresIn': '7d',
  'app.otp.expiresInMinutes': 5,
  'app.nodeEnv': 'test',
  'mail.enabled': true,
};

describe('AuthService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    authSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mailerService = { sendMail: jest.fn() };
  const configService = {
    getOrThrow: jest.fn((key: string) => {
      if (!(key in config)) throw new Error(`missing ${key}`);
      return config[key];
    }),
    get: jest.fn((key: string) => config[key]),
  };
  const jwtService = new JwtService();
  const userService = { revokeAllSessions: jest.fn() };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prisma as never,
      jwtService,
      configService as never,
      mailerService as never,
      userService as never,
    );
  });

  async function signRefresh(extra: Record<string, unknown> = {}) {
    return jwtService.signAsync(
      {
        sub: USER_ID,
        email: 'a@test.com',
        name: 'A',
        role: 'admin',
        sid: SESSION_ID,
        jti: Math.random().toString(36),
        ...extra,
      },
      { secret: config['app.jwt.refreshSecret'] as string, expiresIn: '7d' },
    );
  }

  function sessionRow(overrides: Record<string, unknown> = {}) {
    return {
      id: SESSION_ID,
      userId: USER_ID,
      tokenHash: 'x'.repeat(64),
      previousTokenHash: null,
      previousRotatedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      user: {
        id: USER_ID,
        email: 'a@test.com',
        name: 'A',
        isSuspended: false,
        role: { role_name: 'admin' },
      },
      ...overrides,
    };
  }

  describe('forgotPassword', () => {
    function resetUser(overrides: Record<string, unknown> = {}) {
      return {
        id: 'u1',
        email: 'a@test.com',
        name: 'A',
        resetWindowStartedAt: null,
        resetRequestCount: 0,
        resetFailedCount: 0,
        resetLastSentAt: null,
        ...overrides,
      };
    }

    it('stores reset OTP separately and does not touch login otp', async () => {
      prisma.user.findUnique.mockResolvedValue(resetUser());
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      mailerService.sendMail.mockResolvedValue(undefined);

      await service.forgotPassword({ email: 'a@test.com' });

      expect(prisma.user.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'u1', resetLastSentAt: null },
          data: expect.objectContaining({
            resetOtp: expect.any(String),
            resetOtpExpiresAt: expect.any(Date),
            resetOtpAttempts: 0,
            resetRequestCount: 1,
            resetWindowStartedAt: expect.any(Date),
          }),
        }),
      );
      expect(prisma.user.updateMany.mock.calls[0][0].data.otp).toBeUndefined();
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('enforces a per-account cooldown between reset emails', async () => {
      prisma.user.findUnique.mockResolvedValue(
        resetUser({
          resetWindowStartedAt: new Date(),
          resetRequestCount: 1,
          resetLastSentAt: new Date(Date.now() - RESET_RESEND_COOLDOWN_MS / 2),
        }),
      );

      const result = await service.forgotPassword({ email: 'a@test.com' });

      expect(result.message).toMatch(/If an account exists/);
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('caps reset emails per account per window, whatever the client IP', async () => {
      prisma.user.findUnique.mockResolvedValue(
        resetUser({
          resetWindowStartedAt: new Date(Date.now() - 60 * 60 * 1000),
          resetRequestCount: RESET_MAX_REQUESTS_PER_WINDOW,
          resetLastSentAt: new Date(Date.now() - 10 * 60 * 1000),
        }),
      );

      await service.forgotPassword({ email: 'a@test.com' });

      expect(prisma.user.updateMany).not.toHaveBeenCalled();
      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('stops issuing codes after too many wrong codes in the window', async () => {
      prisma.user.findUnique.mockResolvedValue(
        resetUser({
          resetWindowStartedAt: new Date(Date.now() - 60 * 60 * 1000),
          resetRequestCount: 1,
          resetFailedCount: RESET_MAX_FAILED_PER_WINDOW,
          resetLastSentAt: new Date(Date.now() - 10 * 60 * 1000),
        }),
      );

      await service.forgotPassword({ email: 'a@test.com' });

      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('starts a fresh window once the previous one has expired', async () => {
      const lastSent = new Date(Date.now() - RESET_WINDOW_MS - 1000);
      prisma.user.findUnique.mockResolvedValue(
        resetUser({
          resetWindowStartedAt: new Date(Date.now() - RESET_WINDOW_MS - 5000),
          resetRequestCount: RESET_MAX_REQUESTS_PER_WINDOW,
          resetFailedCount: RESET_MAX_FAILED_PER_WINDOW,
          resetLastSentAt: lastSent,
        }),
      );
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      mailerService.sendMail.mockResolvedValue(undefined);

      await service.forgotPassword({ email: 'a@test.com' });

      expect(prisma.user.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'u1', resetLastSentAt: lastSent },
          data: expect.objectContaining({
            resetRequestCount: 1,
            resetFailedCount: 0,
          }),
        }),
      );
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('does not mail when a concurrent request already issued a code', async () => {
      prisma.user.findUnique.mockResolvedValue(resetUser());
      prisma.user.updateMany.mockResolvedValue({ count: 0 });

      await service.forgotPassword({ email: 'a@test.com' });

      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('returns the generic response for unknown accounts without mailing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.forgotPassword({ email: 'x@test.com' });
      expect(result.message).toMatch(/If an account exists/);
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('does not leak mail failures', async () => {
      prisma.user.findUnique.mockResolvedValue(resetUser());
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      mailerService.sendMail.mockRejectedValue(new Error('smtp down'));

      await expect(
        service.forgotPassword({ email: 'a@test.com' }),
      ).resolves.toMatchObject({ message: expect.any(String) });
      // let the background rejection handler run
      await new Promise((resolve) => setImmediate(resolve));
    });
  });

  describe('confirmResetPassword', () => {
    it('updates the password atomically and revokes every session', async () => {
      const tokenHash = await bcrypt.hash('12345678', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        resetOtp: tokenHash,
        resetOtpExpiresAt: new Date(Date.now() + 60_000),
        resetOtpAttempts: 0,
      });
      prisma.user.updateMany.mockResolvedValue({ count: 1 });

      await service.confirmResetPassword({
        email: 'a@test.com',
        token: '12345678',
        newPassword: 'new-password-123',
      });

      expect(prisma.user.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'u1', resetOtp: tokenHash },
          data: expect.objectContaining({
            resetOtp: null,
            resetOtpExpiresAt: null,
            resetOtpAttempts: 0,
            resetFailedCount: 0,
          }),
        }),
      );
      expect(userService.revokeAllSessions).toHaveBeenCalledWith(
        'u1',
        'password_reset',
      );
    });

    it('rejects a code that was consumed concurrently', async () => {
      const tokenHash = await bcrypt.hash('12345678', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        resetOtp: tokenHash,
        resetOtpExpiresAt: new Date(Date.now() + 60_000),
        resetOtpAttempts: 0,
      });
      prisma.user.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.confirmResetPassword({
          email: 'a@test.com',
          token: '12345678',
          newPassword: 'new-password-123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(userService.revokeAllSessions).not.toHaveBeenCalled();
    });

    it('rejects invalid reset token', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        resetOtp: null,
        resetOtpExpiresAt: null,
        resetOtpAttempts: 0,
      });

      await expect(
        service.confirmResetPassword({
          email: 'a@test.com',
          token: 'bad',
          newPassword: 'new-password-123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('invalidates the code after the maximum number of wrong guesses', async () => {
      const tokenHash = await bcrypt.hash('12345678', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        resetOtp: tokenHash,
        resetOtpExpiresAt: new Date(Date.now() + 60_000),
        resetOtpAttempts: RESET_CODE_MAX_ATTEMPTS - 1,
      });
      prisma.user.update.mockResolvedValue({
        resetOtpAttempts: RESET_CODE_MAX_ATTEMPTS,
        resetFailedCount: 1,
      });
      prisma.user.updateMany.mockResolvedValue({ count: 1 });

      await expect(
        service.confirmResetPassword({
          email: 'a@test.com',
          token: '87654321',
          newPassword: 'new-password-123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            resetOtpAttempts: { increment: 1 },
            resetFailedCount: { increment: 1 },
          },
        }),
      );
      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: { id: 'u1', resetOtp: tokenHash },
        data: { resetOtp: null, resetOtpExpiresAt: null, resetOtpAttempts: 0 },
      });
    });

    it('refuses even the right code once the attempt limit is reached', async () => {
      const tokenHash = await bcrypt.hash('12345678', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        resetOtp: tokenHash,
        resetOtpExpiresAt: new Date(Date.now() + 60_000),
        resetOtpAttempts: RESET_CODE_MAX_ATTEMPTS,
      });
      prisma.user.update.mockResolvedValue({});

      await expect(
        service.confirmResetPassword({
          email: 'a@test.com',
          token: '12345678',
          newPassword: 'new-password-123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
    });

    it('refuses the right code once the account used up its wrong guesses', async () => {
      const tokenHash = await bcrypt.hash('12345678', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        resetOtp: tokenHash,
        resetOtpExpiresAt: new Date(Date.now() + 60_000),
        resetOtpAttempts: 0,
        resetFailedCount: RESET_MAX_FAILED_PER_WINDOW,
        resetWindowStartedAt: new Date(Date.now() - 60_000),
      });
      prisma.user.update.mockResolvedValue({});

      await expect(
        service.confirmResetPassword({
          email: 'a@test.com',
          token: '12345678',
          newPassword: 'new-password-123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
    });

    it('stores the new password with the production bcrypt cost', async () => {
      const tokenHash = await bcrypt.hash('12345678', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        resetOtp: tokenHash,
        resetOtpExpiresAt: new Date(Date.now() + 60_000),
        resetOtpAttempts: 0,
        resetFailedCount: 0,
        resetWindowStartedAt: new Date(),
      });
      prisma.user.updateMany.mockResolvedValue({ count: 1 });

      await service.confirmResetPassword({
        email: 'a@test.com',
        token: '12345678',
        newPassword: 'new-password-123',
      });

      const stored = prisma.user.updateMany.mock.calls[0][0].data
        .password as string;
      expect(bcrypt.getRounds(stored)).toBe(12);
    });
  });

  describe('login OTP', () => {
    async function userWithOtp(overrides: Record<string, unknown> = {}) {
      return {
        id: USER_ID,
        email: 'a@test.com',
        name: 'A',
        password: await bcrypt.hash('correct-password', 4),
        otp: await bcrypt.hash('123456', 4),
        otpExpiresAt: new Date(Date.now() + 60_000),
        otpLockedUntil: null,
        isSuspended: false,
        role: { role_name: 'admin' },
        ...overrides,
      };
    }

    it('creates a new session per login and consumes the OTP atomically', async () => {
      const user = await userWithOtp();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      prisma.authSession.create.mockResolvedValue({});
      prisma.authSession.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.login(
        { email: 'a@test.com', password: 'correct-password', otp: '123456' },
        'jest-agent',
      );

      expect('tokens' in result).toBe(true);
      expect(prisma.user.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: USER_ID, otp: user.otp } }),
      );
      const created = prisma.authSession.create.mock.calls[0][0].data;
      expect(created).toMatchObject({
        userId: USER_ID,
        userAgent: 'jest-agent',
      });
      if ('tokens' in result) {
        expect(created.tokenHash).toBe(sha256(result.tokens.refreshToken!));
        const payload = jwtService.decode<{ sid: string }>(
          result.tokens.accessToken,
        );
        expect(payload.sid).toBe(created.id);
      }
    });

    it('upgrades a legacy low-cost password hash after a successful login', async () => {
      const user = await userWithOtp();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      prisma.authSession.create.mockResolvedValue({});
      prisma.authSession.deleteMany.mockResolvedValue({ count: 0 });

      await service.login({
        email: 'a@test.com',
        password: 'correct-password',
        otp: '123456',
      });

      const upgrade = prisma.user.updateMany.mock.calls.find(
        ([args]) => 'password' in args.data,
      )?.[0];
      const upgradedHash = upgrade?.data.password as string;
      expect(upgrade?.where).toEqual({ id: USER_ID, password: user.password });
      expect(bcrypt.getRounds(upgradedHash)).toBe(12);
      await expect(
        bcrypt.compare('correct-password', upgradedHash),
      ).resolves.toBe(true);
    });

    it('does not rehash a password that already uses the current cost', async () => {
      const user = await userWithOtp({
        password: await bcrypt.hash('correct-password', 12),
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      prisma.authSession.create.mockResolvedValue({});
      prisma.authSession.deleteMany.mockResolvedValue({ count: 0 });

      await service.login({
        email: 'a@test.com',
        password: 'correct-password',
        otp: '123456',
      });

      expect(
        prisma.user.updateMany.mock.calls.some(
          ([args]) => 'password' in args.data,
        ),
      ).toBe(false);
    });

    it('does not rehash when only the password step (no OTP) succeeds', async () => {
      prisma.user.findUnique.mockResolvedValue(await userWithOtp());
      prisma.user.update.mockResolvedValue({});
      mailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.login({
        email: 'a@test.com',
        password: 'correct-password',
      });

      expect(result).toMatchObject({ requiresOtp: true });
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
    });

    it('rejects an OTP that a concurrent request already used', async () => {
      prisma.user.findUnique.mockResolvedValue(await userWithOtp());
      prisma.user.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.login({
          email: 'a@test.com',
          password: 'correct-password',
          otp: '123456',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.authSession.create).not.toHaveBeenCalled();
    });

    it('rejects while the OTP lockout (persisted on the user) is active', async () => {
      prisma.user.findUnique.mockResolvedValue(
        await userWithOtp({ otpLockedUntil: new Date(Date.now() + 60_000) }),
      );

      await expect(
        service.login({
          email: 'a@test.com',
          password: 'correct-password',
          otp: '123456',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
    });

    it('locks OTP login after too many wrong codes', async () => {
      prisma.user.findUnique.mockResolvedValue(await userWithOtp());
      prisma.user.update
        .mockResolvedValueOnce({ otpFailedAttempts: 5 })
        .mockResolvedValueOnce({});

      await expect(
        service.login({
          email: 'a@test.com',
          password: 'correct-password',
          otp: '000000',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.user.update).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            otp: null,
            otpLockedUntil: expect.any(Date),
          }),
        }),
      );
    });
  });

  describe('refreshToken', () => {
    it('rotates the refresh token inside the session', async () => {
      const token = await signRefresh();
      prisma.authSession.findUnique.mockResolvedValue(
        sessionRow({ tokenHash: sha256(token) }),
      );
      prisma.authSession.updateMany.mockResolvedValue({ count: 1 });

      const tokens = await service.refreshToken(token);

      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.refreshToken).not.toBe(token);
      expect(prisma.authSession.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: SESSION_ID, tokenHash: sha256(token), revokedAt: null },
          data: expect.objectContaining({
            tokenHash: sha256(tokens.refreshToken!),
            previousTokenHash: sha256(token),
            previousRotatedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('accepts the just-rotated token within the grace window (access only)', async () => {
      const token = await signRefresh();
      prisma.authSession.findUnique.mockResolvedValue(
        sessionRow({
          previousTokenHash: sha256(token),
          previousRotatedAt: new Date(Date.now() - 1_000),
        }),
      );

      const tokens = await service.refreshToken(token);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeUndefined();
      expect(prisma.authSession.updateMany).not.toHaveBeenCalled();
    });

    it('handles losing a concurrent rotation race via the grace path', async () => {
      const token = await signRefresh();
      prisma.authSession.findUnique
        .mockResolvedValueOnce(sessionRow({ tokenHash: sha256(token) }))
        .mockResolvedValueOnce({
          previousTokenHash: sha256(token),
          previousRotatedAt: new Date(),
          revokedAt: null,
        });
      prisma.authSession.updateMany.mockResolvedValue({ count: 0 });

      const tokens = await service.refreshToken(token);
      expect(tokens.refreshToken).toBeUndefined();
      expect(tokens.accessToken).toBeDefined();
    });

    it('revokes the whole session when an old token is reused after the grace window', async () => {
      const token = await signRefresh();
      prisma.authSession.findUnique.mockResolvedValue(
        sessionRow({
          previousTokenHash: sha256(token),
          previousRotatedAt: new Date(Date.now() - REFRESH_GRACE_MS - 5_000),
        }),
      );
      prisma.authSession.updateMany.mockResolvedValue({ count: 1 });

      await expect(service.refreshToken(token)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(prisma.authSession.updateMany).toHaveBeenCalledWith({
        where: { id: SESSION_ID, revokedAt: null },
        data: { revokedAt: expect.any(Date), revokedReason: 'reuse_detected' },
      });
    });

    it('rejects tokens of revoked sessions', async () => {
      const token = await signRefresh();
      prisma.authSession.findUnique.mockResolvedValue(
        sessionRow({ tokenHash: sha256(token), revokedAt: new Date() }),
      );
      await expect(service.refreshToken(token)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects legacy tokens without a session id', async () => {
      const token = await signRefresh({ sid: undefined });
      await expect(service.refreshToken(token)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(prisma.authSession.findUnique).not.toHaveBeenCalled();
    });

    it('refuses suspended users', async () => {
      const token = await signRefresh();
      prisma.authSession.findUnique.mockResolvedValue(
        sessionRow({
          tokenHash: sha256(token),
          user: { ...sessionRow().user, isSuspended: true },
        }),
      );
      prisma.authSession.updateMany.mockResolvedValue({ count: 1 });
      await expect(service.refreshToken(token)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('logout', () => {
    it('revokes the session even when the refresh token has expired', async () => {
      const expired = await jwtService.signAsync(
        {
          sub: USER_ID,
          sid: SESSION_ID,
          exp: Math.floor(Date.now() / 1000) - 60,
        },
        { secret: config['app.jwt.refreshSecret'] as string },
      );
      prisma.authSession.updateMany.mockResolvedValue({ count: 1 });

      await service.logout(expired, undefined);

      expect(prisma.authSession.updateMany).toHaveBeenCalledWith({
        where: { id: SESSION_ID, revokedAt: null },
        data: { revokedAt: expect.any(Date), revokedReason: 'logout' },
      });
    });

    it('falls back to the access token session id', async () => {
      const access = await jwtService.signAsync(
        { sub: USER_ID, sid: SESSION_ID },
        { secret: config['app.jwt.accessSecret'] as string, expiresIn: '1m' },
      );
      prisma.authSession.updateMany.mockResolvedValue({ count: 1 });
      await service.logout(undefined, access);
      expect(prisma.authSession.updateMany).toHaveBeenCalled();
    });

    it('does nothing (and does not throw) for forged tokens', async () => {
      const forged = await jwtService.signAsync(
        { sub: USER_ID, sid: SESSION_ID },
        { secret: 'not-the-real-secret-not-the-real-secret' },
      );
      await expect(service.logout(forged, 'garbage')).resolves.toBeDefined();
      expect(prisma.authSession.updateMany).not.toHaveBeenCalled();
    });
  });
});
