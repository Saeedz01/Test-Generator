import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import {
  AuthTokens,
  LoginResult,
  TokenPayload,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
        // role: true,
        role_id: {
          role_name: true,
        },
      },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const role = user.role_id?.role_name;
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
        // role: true,
        role_id: {
          role_name: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
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

  private async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessSecret =
      this.configService.getOrThrow<string>('app.jwt.accessSecret');
    const refreshSecret =
      this.configService.getOrThrow<string>('app.jwt.refreshSecret');
    const accessExpires = this.configService.getOrThrow<string>(
      'app.jwt.accessExpiresIn',
    );
    const refreshExpires = this.configService.getOrThrow<string>(
      'app.jwt.refreshExpiresIn',
    );

    // here "secret" and "expiresIn" should be fixed because signOptions in signAsync aspect the  same varibale
    const signOptions = (secret: string, expiresIn: string,): JwtSignOptions => ({
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });

    const [accessToken, refreshToken] = await Promise.all([
      //this is the actual structure but we use the signOptions function for better readability,
      //  here "secret" and "expiresIn" should be fixed because signOptions aspect the  same varibale
      // this.jwtService.signAsync(payload, { secret: accessSecret,expiresIn: accessExpires as JwtSignOptions['expiresIn']}),
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
