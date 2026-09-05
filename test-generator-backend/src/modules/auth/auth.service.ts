import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  AuthTokens,
  LoginResult,
  OtpPendingResult,
  TokenPayload,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}


  async login(loginDto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['role_id'],
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
          role_name: true,
        },
      },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.isSuspended) {
      throw new ForbiddenException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    const role = user.role_id?.role_name;
    const isPanelUser = role === Role.ADMIN || role === Role.SUPER_ADMIN;

    if (loginDto.otp) {
      await this.verifyOtp(user, loginDto.otp);
    } else if (!isPanelUser) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role,
    };

    const tokens = await this.generateTokens(payload);

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
    const user = await this.userRepository.findOne({
      where: { email: sendOtpDto.email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    return this.sendLoginOtp(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const temporaryPassword = this.generateOtp();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your temporary password - Testora',
      template: 'forgot-password',
      context: {
        name: user.name ?? 'User',
        password: temporaryPassword,
        year: new Date().getFullYear(),
      },
    });

    return { message: 'Temporary password sent to your email address' };
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
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

    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    return { message: 'Password updated successfully' };
  }

  // async logout(userId: string) {
  //   await this.refreshTokenModel.destroy({ where: { userId } });
  //   return { message: 'Logged out successfully' };
  // }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
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

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role_id'],
      select: {
        id: true,
        email: true,
        name: true,
        isSuspended: true,
        role_id: {
          role_name: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (user.isSuspended) {
      throw new ForbiddenException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    return this.generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role_id?.role_name,
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
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role_id'],
      select: {
        id: true,
        email: true,
        name: true,
        isSuspended: true,
        role_id: {
          role_name: true,
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

    await this.userRepository.update(user.id, {
      otp: hashedOtp,
      otpExpiresAt,
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
      message: 'OTP sent to your email address',
      expiresInMinutes,
    };
  }

  private async verifyOtp(user: User, otp: string): Promise<void> {
    if (!user.otp || !user.otpExpiresAt) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      await this.clearOtp(user.id);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OTP);
    }

    await this.clearOtp(user.id);
  }

  private async clearOtp(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      otp: null,
      otpExpiresAt: null,
    });
  }

  private generateOtp(): string {
    return randomInt(100000, 1000000).toString();
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
