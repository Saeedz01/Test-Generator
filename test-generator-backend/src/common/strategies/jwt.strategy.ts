import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { TokenPayload } from '../../modules/auth/interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// when app starts then this strategy is registered in passport registry with the name 'jwt', we can set any name for the strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // if you want to fetch the token from the header then use this
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // if you want to fetch the token from the cookies then use this
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const cookies = req?.cookies as Record<string, unknown> | undefined;
          const token = cookies?.access_token;
          return typeof token === 'string' ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('app.jwt.accessSecret'),
    });
  }

  async validate(payload: TokenPayload) {
    // Access tokens are bound to an auth session so logout / password reset /
    // suspension take effect immediately instead of after the token expires.
    if (!payload?.sub || !payload.sid || !UUID_RE.test(payload.sid)) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        isSuspended: true,
        // role: true,
        role: {
          select: {
            role_name: true,
          },
        },
        sessions: {
          where: {
            id: payload.sid,
            revokedAt: null,
            expiresAt: { gt: new Date() },
          },
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!user || user.sessions.length === 0) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (user.isSuspended) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      // role: user.role?.role_name ?? user.role,
      role: user.role?.role_name,
    };
  }
}
