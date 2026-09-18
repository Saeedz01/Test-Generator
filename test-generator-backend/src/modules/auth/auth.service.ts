import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt, randomUUID, createHash, timingSafeEqual } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import {
  AuthTokens,
  LoginResponse,
  OtpPendingResult,
  TokenPayload,
} from './interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';

/** Wrong login-OTP attempts before the account's OTP login is locked. */
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_LOCK_MS = 15 * 60 * 1000;
/** Wrong reset-code attempts before the reset code is invalidated. */
export const RESET_CODE_MAX_ATTEMPTS = 5;
export const RESET_CODE_TTL_MINUTES = 30;
/**
 * A refresh token that was rotated less than this long ago is still accepted
 * (issuing only a new access token) so concurrent tabs/requests that raced on
 * the same refresh token do not sign the user out.
 */
export const REFRESH_GRACE_MS = 30_000;

// Used to spend comparable bcrypt time when the account does not exist.
const DUMMY_BCRYPT_HASH =
  '$2b$10$abcdefghijklmnopqrstuvC6.uYj6YZq5eYfQwQe1uK1b0e1e1e1e';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto, userAgent?: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        otp: true,
        otpExpiresAt: true,
        otpLockedUntil: true,
        isSuspended: true,
        // role: true,
        role: {
          select: {
            role_name: true,
          },
        },
      },
    });

    const passwordOk = await bcrypt.compare(
      loginDto.password,
      user?.password ?? DUMMY_BCRYPT_HASH,
    );
    if (!user || !passwordOk) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.isSuspended) {
      throw new ForbiddenException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    if (!loginDto.otp) {
      return this.sendLoginOtp(user as unknown as User);
    }

    await this.verifyOtp(user, loginDto.otp);

    const role = user.role?.role_name as string;
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role,
    };

    const tokens = await this.createSession(payload, userAgent);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
      },
      // user:{...payload},
      tokens,
    };
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<OtpPendingResult> {
    const generic: OtpPendingResult = {
      requiresOtp: true,
      message: 'If the account exists, an OTP has been sent',
      expiresInMinutes: this.otpExpiresInMinutes(),
    };

    const user = await this.prisma.user.findUnique({
      where: { email: sendOtpDto.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isSuspended: true,
      },
    });

    const passwordHash = user?.password ?? DUMMY_BCRYPT_HASH;
    const passwordOk = await bcrypt.compare(sendOtpDto.password, passwordHash);
    if (!user || !passwordOk || user.isSuspended) {
      return generic;
    }

    return this.sendLoginOtp(user as unknown as User);
  }

  /**
   * Always returns the same response and does roughly the same work whether
   * or not the account exists; the email is sent in the background so SMTP
   * latency/failures cannot be used to enumerate accounts.
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const generic = {
      message:
        'If an account exists for that email, a reset code has been sent',
    };

    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const resetCode = this.generateResetCode();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    if (!user) {
      return generic;
    }

    const resetOtpExpiresAt = new Date(
      Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtp: hashedCode,
        resetOtpExpiresAt,
        resetOtpAttempts: 0,
      },
    });

    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Your password reset code - Testora',
        template: 'forgot-password',
        context: {
          name: user.name ?? 'User',
          code: resetCode,
          expiresInMinutes: RESET_CODE_TTL_MINUTES,
          year: new Date().getFullYear(),
        },
      })
      .then(() =>
        this.logger.log(`Password reset code emailed to user ${user.id}`),
      )
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Failed to send password reset email: ${message}`);
      });

    return generic;
  }

  async confirmResetPassword(dto: ConfirmResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        resetOtp: true,
        resetOtpExpiresAt: true,
        resetOtpAttempts: true,
      },
    });

    if (!user?.resetOtp || !user.resetOtpExpiresAt) {
      await bcrypt.compare(dto.token, DUMMY_BCRYPT_HASH);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (user.resetOtpExpiresAt.getTime() < Date.now()) {
      await this.clearResetOtp(user.id);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if ((user.resetOtpAttempts ?? 0) >= RESET_CODE_MAX_ATTEMPTS) {
      await this.clearResetOtp(user.id);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const isValid = await bcrypt.compare(dto.token, user.resetOtp);
    if (!isValid) {
      await this.recordResetFailure(user.id, user.resetOtp);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    // Consume the code atomically: only succeeds if it has not been used or
    // replaced in the meantime, so a code can never be redeemed twice.
    const consumed = await this.prisma.user.updateMany({
      where: { id: user.id, resetOtp: user.resetOtp },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpiresAt: null,
        resetOtpAttempts: 0,
      },
    });
    if (consumed.count === 0) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    await this.userService.revokeAllSessions(user.id, 'password_reset');

    return { message: 'Password updated successfully' };
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (
      !user ||
      !(await bcrypt.compare(resetPasswordDto.oldPassword, user.password))
    ) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });
    await this.userService.revokeAllSessions(user.id, 'password_change');

    return { message: 'Password updated successfully' };
  }

  // async logout(userId: string) {
  //   await this.refreshTokenModel.destroy({ where: { userId } });
  //   return { message: 'Logged out successfully' };
  // }

  /**
   * Revokes the session identified by the refresh cookie (or, failing that,
   * the access cookie). Works with expired tokens; never throws for bad or
   * missing tokens because the caller always clears the cookies.
   */
  async logout(refreshToken?: string, accessToken?: string) {
    const sid =
      this.sessionIdFromToken(refreshToken, 'app.jwt.refreshSecret') ??
      this.sessionIdFromToken(accessToken, 'app.jwt.accessSecret');

    if (sid) {
      await this.prisma.authSession.updateMany({
        where: { id: sid, revokedAt: null },
        data: { revokedAt: new Date(), revokedReason: 'logout' },
      });
    }

    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string | undefined): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const refreshSecret = this.configService.getOrThrow<string>(
      'app.jwt.refreshSecret',
    );
    let payload: TokenPayload;
    try {
      payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (!payload.sid || !this.isUuid(payload.sid)) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const session = await this.prisma.authSession.findUnique({
      where: { id: payload.sid },
      select: {
        id: true,
        userId: true,
        tokenHash: true,
        previousTokenHash: true,
        previousRotatedAt: true,
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isSuspended: true,
            role: {
              select: {
                role_name: true,
              },
            },
          },
        },
      },
    });

    if (
      !session ||
      session.userId !== payload.sub ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const { user } = session;
    if (user.isSuspended) {
      await this.revokeSession(session.id, 'suspended');
      throw new ForbiddenException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    const nextPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.role_name as string,
      sid: session.id,
    };
    const presentedHash = this.hashRefreshToken(refreshToken);

    if (this.hashesMatch(session.tokenHash, presentedHash)) {
      const tokens = await this.generateTokens(nextPayload);
      const now = new Date();
      const rotated = await this.prisma.authSession.updateMany({
        where: { id: session.id, tokenHash: presentedHash, revokedAt: null },
        data: {
          tokenHash: this.hashRefreshToken(tokens.refreshToken as string),
          previousTokenHash: presentedHash,
          previousRotatedAt: now,
          expiresAt: new Date(now.getTime() + tokens.refreshExpiresIn * 1000),
          lastUsedAt: now,
        },
      });
      if (rotated.count === 1) {
        return tokens;
      }

      // Lost a race with a concurrent refresh using the same token.
      const latest = await this.prisma.authSession.findUnique({
        where: { id: session.id },
        select: {
          previousTokenHash: true,
          previousRotatedAt: true,
          revokedAt: true,
        },
      });
      if (
        latest &&
        !latest.revokedAt &&
        this.withinGrace(latest, presentedHash)
      ) {
        return this.accessOnlyTokens(nextPayload);
      }
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (this.withinGrace(session, presentedHash)) {
      return this.accessOnlyTokens(nextPayload);
    }

    // A genuinely issued but already-rotated token was replayed outside the
    // grace window: assume it was stolen and kill the whole session.
    this.logger.warn(
      `Refresh token reuse detected for session ${session.id}; session revoked`,
    );
    await this.revokeSession(session.id, 'reuse_detected');
    throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
  }

  verifyAccessToken(token: string): TokenPayload | null {
    const accessSecret = this.configService.getOrThrow<string>(
      'app.jwt.accessSecret',
    );

    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: accessSecret,
      });
    } catch {
      return null;
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isSuspended: true,
        role: {
          select: {
            role_name: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (user.isSuspended) {
      throw new ForbiddenException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.role_name,
      isSuspended: user.isSuspended,
    };
  }

  listAdmins() {
    return this.userService.findAllAdmins();
  }

  createAdmin(email: string, password: string, name?: string) {
    return this.userService.createAdmin(email, password, name);
  }

  toggleAdminSuspension(id: string) {
    return this.userService.toggleSuspendAdmin(id);
  }

  deleteAdmin(id: string) {
    return this.userService.removeAdmin(id);
  }

  private otpExpiresInMinutes(): number {
    return this.configService.get<number>('app.otp.expiresInMinutes') ?? 5;
  }

  /** Plaintext OTPs may only ever be logged on an explicit development box. */
  private canLogDevOtp(): boolean {
    return (
      process.env.NODE_ENV === 'development' &&
      this.configService.get<string>('app.nodeEnv') === 'development'
    );
  }

  private async sendLoginOtp(user: User) {
    const expiresInMinutes = this.otpExpiresInMinutes();
    const otp = this.generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: hashedOtp,
        otpExpiresAt,
      },
    });

    if (
      !this.configService.get<boolean>('mail.enabled') &&
      this.canLogDevOtp()
    ) {
      this.logger.warn(
        `Mail disabled (dev): login OTP for ${user.email} is ${otp} (expires in ${expiresInMinutes}m)`,
      );
    }

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Your login OTP - Testora',
        template: 'otp',
        context: {
          name: user.name ?? 'User',
          otp,
          expiresInMinutes,
          year: new Date().getFullYear(),
        },
      });
      this.logger.log(`Login OTP emailed to user ${user.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send login OTP email: ${message}`);
      if (this.canLogDevOtp()) {
        this.logger.warn(
          `Dev fallback: login OTP for ${user.email} is ${otp} (expires in ${expiresInMinutes}m)`,
        );
      }
      throw new ServiceUnavailableException(ERROR_MESSAGES.OTP_SEND_FAILED);
    }

    // await this.mailerService.sendMail({
    //   to: user.email,
    //   subject: 'Your login OTP',
    //   text: `Your login OTP is ${otp}. It expires in ${expiresInMinutes} minutes.`,
    //   html: `<p>Your login OTP is <strong>${otp}</strong>.</p><p>It expires in ${expiresInMinutes} minutes.</p>`,
    // });

    return {
      requiresOtp: true as const,
      message: 'If the account exists, an OTP has been sent',
      expiresInMinutes,
    };
  }

  private async verifyOtp(
    user: {
      id: string;
      otp: string | null;
      otpExpiresAt: Date | null;
      otpLockedUntil: Date | null;
    },
    otp: string,
  ): Promise<void> {
    if (user.otpLockedUntil && user.otpLockedUntil.getTime() > Date.now()) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    if (!user.otp || !user.otpExpiresAt) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      await this.clearOtp(user.id);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      await this.recordOtpFailure(user.id);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    // Atomic single use: two concurrent logins with the same OTP cannot both
    // pass, because only one conditional update can still see this hash.
    const consumed = await this.prisma.user.updateMany({
      where: { id: user.id, otp: user.otp },
      data: {
        otp: null,
        otpExpiresAt: null,
        otpFailedAttempts: 0,
        otpLockedUntil: null,
      },
    });
    if (consumed.count === 0) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }
  }

  private async clearOtp(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        otp: null,
        otpExpiresAt: null,
      },
    });
  }

  private async clearResetOtp(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetOtp: null,
        resetOtpExpiresAt: null,
        resetOtpAttempts: 0,
      },
    });
  }

  private generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  private generateResetCode(): string {
    return randomInt(10_000_000, 100_000_000).toString();
  }

  /** Persisted (multi-instance safe) OTP lockout. */
  private async recordOtpFailure(userId: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { otpFailedAttempts: { increment: 1 } },
      select: { otpFailedAttempts: true },
    });
    if (updated.otpFailedAttempts >= OTP_MAX_ATTEMPTS) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          otp: null,
          otpExpiresAt: null,
          otpFailedAttempts: 0,
          otpLockedUntil: new Date(Date.now() + OTP_LOCK_MS),
        },
      });
    }
  }

  /** Invalidates the reset code after RESET_CODE_MAX_ATTEMPTS wrong guesses. */
  private async recordResetFailure(userId: string, codeHash: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { resetOtpAttempts: { increment: 1 } },
      select: { resetOtpAttempts: true },
    });
    if (updated.resetOtpAttempts >= RESET_CODE_MAX_ATTEMPTS) {
      await this.prisma.user.updateMany({
        where: { id: userId, resetOtp: codeHash },
        data: {
          resetOtp: null,
          resetOtpExpiresAt: null,
          resetOtpAttempts: 0,
        },
      });
    }
  }

  private hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private hashesMatch(stored: string | null | undefined, actualHash: string) {
    if (!stored) {
      return false;
    }
    const expected = Buffer.from(stored);
    const actual = Buffer.from(actualHash);
    if (expected.length !== actual.length) {
      return false;
    }
    return timingSafeEqual(expected, actual);
  }

  private withinGrace(
    session: {
      previousTokenHash: string | null;
      previousRotatedAt: Date | null;
    },
    presentedHash: string,
  ) {
    return (
      !!session.previousRotatedAt &&
      Date.now() - session.previousRotatedAt.getTime() <= REFRESH_GRACE_MS &&
      this.hashesMatch(session.previousTokenHash, presentedHash)
    );
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  private sessionIdFromToken(
    token: string | undefined,
    secretKey: 'app.jwt.refreshSecret' | 'app.jwt.accessSecret',
  ): string | null {
    if (!token) {
      return null;
    }
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.getOrThrow<string>(secretKey),
        ignoreExpiration: true,
      });
      return payload.sid && this.isUuid(payload.sid) ? payload.sid : null;
    } catch {
      return null;
    }
  }

  private async revokeSession(sessionId: string, reason: string) {
    await this.prisma.authSession.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: reason },
    });
  }

  /** Starts a new device session (one row per login) and returns its tokens. */
  private async createSession(
    payload: TokenPayload,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const sessionId = randomUUID();
    const tokens = await this.generateTokens({ ...payload, sid: sessionId });
    const now = Date.now();

    await this.prisma.authSession.create({
      data: {
        id: sessionId,
        userId: payload.sub,
        tokenHash: this.hashRefreshToken(tokens.refreshToken as string),
        expiresAt: new Date(now + tokens.refreshExpiresIn * 1000),
        userAgent: userAgent?.slice(0, 255) || null,
      },
    });

    // Housekeeping: drop this user's long-dead sessions.
    await this.prisma.authSession.deleteMany({
      where: {
        userId: payload.sub,
        OR: [
          { expiresAt: { lt: new Date(now) } },
          { revokedAt: { lt: new Date(now - 24 * 60 * 60 * 1000) } },
        ],
      },
    });

    return tokens;
  }

  private async accessOnlyTokens(payload: TokenPayload): Promise<AuthTokens> {
    const tokens = await this.generateTokens(payload);
    return { ...tokens, refreshToken: undefined };
  }

  private async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessSecret = this.configService.getOrThrow<string>(
      'app.jwt.accessSecret',
    );
    const refreshSecret = this.configService.getOrThrow<string>(
      'app.jwt.refreshSecret',
    );
    const accessExpires = this.configService.getOrThrow<string>(
      'app.jwt.accessExpiresIn',
    );
    const refreshExpires = this.configService.getOrThrow<string>(
      'app.jwt.refreshExpiresIn',
    );

    // here "secret" and "expiresIn" should be fixed because signOptions in signAsync aspect the  same varibale
    const signOptions = (
      secret: string,
      expiresIn: string,
    ): JwtSignOptions => ({
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });

    const claims: TokenPayload = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      sid: payload.sid,
    };

    const [accessToken, refreshToken] = await Promise.all([
      //this.jwtService.signAsync(payload, { secret: accessSecret,expiresIn: accessExpires as JwtSignOptions['expiresIn']}),
      //this is the actual structure but we use the signOptions function for better readability,
      //here "secret" and "expiresIn" should be fixed because signOptions aspect the  same varibale
      this.jwtService.signAsync(
        claims,
        signOptions(accessSecret, accessExpires),
      ),
      this.jwtService.signAsync(
        { ...claims, jti: randomUUID() },
        signOptions(refreshSecret, refreshExpires),
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseTimeToSeconds(accessExpires),
      refreshExpiresIn: this.parseTimeToSeconds(refreshExpires),
    };
  }

  private parseTimeToSeconds(time: string): number {
    const match = /^(\d+)([smhd])$/.exec(time.trim());
    if (!match) {
      return 900;
    }

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return parseInt(match[1], 10) * multipliers[match[2]];
  }
}
