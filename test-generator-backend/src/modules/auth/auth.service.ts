import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt, createHash, timingSafeEqual } from 'crypto';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}


  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        otp: true,
        otpExpiresAt: true,
        isSuspended: true,
        // role: true,
        role_id: {
          select: {
            role_name: true,
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.isSuspended) {
      throw new ForbiddenException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    if (!loginDto.otp) {
      return this.sendLoginOtp(user as User);
    }

    await this.verifyOtp(user as User, loginDto.otp);

    const role = user.role_id?.role_name as string;
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role,
    };

    const tokens = await this.issueTokens(payload);

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
      expiresInMinutes: 5,
    };

    const user = await this.prisma.user.findUnique({
      where: { email: sendOtpDto.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    const passwordHash =
      user?.password ?? '$2b$10$abcdefghijklmnopqrstuvC6.uYj6YZq5eYfQwQe1uK1b0e1e1e1e';
    const passwordOk = await bcrypt.compare(sendOtpDto.password, passwordHash);
    if (!user || !passwordOk) {
      return generic;
    }

    return this.sendLoginOtp(user as User);
  }

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
    if (!user) {
      return generic;
    }

    const resetCode = this.generateResetCode();
    const hashedCode = await bcrypt.hash(resetCode, 10);
    const otpExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: hashedCode,
        otpExpiresAt,
      },
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your password reset code - Testora',
      template: 'forgot-password',
      context: {
        name: user.name ?? 'User',
        code: resetCode,
        expiresInMinutes: 30,
        year: new Date().getFullYear(),
      },
    });

    return generic;
  }

  async confirmResetPassword(dto: ConfirmResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        otp: true,
        otpExpiresAt: true,
      },
    });

    if (!user?.otp || !user.otpExpiresAt) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      await this.clearOtp(user.id);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const isValid = await bcrypt.compare(dto.token, user.otp);
    if (!isValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });

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

    return { message: 'Password updated successfully' };
  }

  // async logout(userId: string) {
  //   await this.refreshTokenModel.destroy({ where: { userId } });
  //   return { message: 'Logged out successfully' };
  // }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string | undefined): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const refreshSecret =
      this.configService.getOrThrow<string>('app.jwt.refreshSecret');
    let payload: TokenPayload;
    try {
      payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        isSuspended: true,
        refreshTokenHash: true,
        role_id: {
          select: {
            role_name: true,
          },
        },
      },
    });

    if (!user || !this.refreshHashesMatch(user.refreshTokenHash, refreshToken)) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (user.isSuspended) {
      throw new ForbiddenException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    return this.issueTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role_id?.role_name as string,
    });
  }

  verifyAccessToken(token: string): TokenPayload | null {
    const accessSecret =
      this.configService.getOrThrow<string>('app.jwt.accessSecret');

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
        role_id: {
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
      role: user.role_id?.role_name,
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

  private async sendLoginOtp(user: User) {
    const expiresInMinutes = 5;
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

  private async verifyOtp(user: User, otp: string): Promise<void> {
    this.assertOtpUnlocked(user.id);

    if (!user.otp || !user.otpExpiresAt) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      await this.clearOtp(user.id);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      this.recordOtpFailure(user.id);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    this.otpFailures.delete(user.id);
    await this.clearOtp(user.id);
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

  private generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  private generateResetCode(): string {
    return randomInt(10_000_000, 100_000_000).toString();
  }

  private readonly otpFailures = new Map<
    string,
    { fails: number; lockedUntil: number }
  >();

  private assertOtpUnlocked(userId: string) {
    const row = this.otpFailures.get(userId);
    if (row?.lockedUntil && row.lockedUntil > Date.now()) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }
  }

  private recordOtpFailure(userId: string) {
    const row = this.otpFailures.get(userId) ?? { fails: 0, lockedUntil: 0 };
    row.fails += 1;
    if (row.fails >= 5) {
      row.lockedUntil = Date.now() + 15 * 60 * 1000;
      row.fails = 0;
    }
    this.otpFailures.set(userId, row);
  }

  private hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private refreshHashesMatch(stored: string | null | undefined, token: string) {
    if (!stored) {
      return false;
    }
    const expected = Buffer.from(stored);
    const actual = Buffer.from(this.hashRefreshToken(token));
    if (expected.length !== actual.length) {
      return false;
    }
    return timingSafeEqual(expected, actual);
  }

  private async issueTokens(payload: TokenPayload): Promise<AuthTokens> {
    const tokens = await this.generateTokens(payload);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { refreshTokenHash: this.hashRefreshToken(tokens.refreshToken) },
    });
    return tokens;
  }

  private async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessSecret =this.configService.getOrThrow<string>('app.jwt.accessSecret');
    const refreshSecret =this.configService.getOrThrow<string>('app.jwt.refreshSecret');
    const accessExpires = this.configService.getOrThrow<string>('app.jwt.accessExpiresIn');
    const refreshExpires = this.configService.getOrThrow<string>('app.jwt.refreshExpiresIn');

    // here "secret" and "expiresIn" should be fixed because signOptions in signAsync aspect the  same varibale
    const signOptions = (secret: string, expiresIn: string,): JwtSignOptions => ({
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });

    const [accessToken, refreshToken] = await Promise.all([
      //this.jwtService.signAsync(payload, { secret: accessSecret,expiresIn: accessExpires as JwtSignOptions['expiresIn']}),
      //this is the actual structure but we use the signOptions function for better readability,
      //here "secret" and "expiresIn" should be fixed because signOptions aspect the  same varibale
      this.jwtService.signAsync(payload, signOptions(accessSecret, accessExpires)),
      this.jwtService.signAsync(payload, signOptions(refreshSecret, refreshExpires)),
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
