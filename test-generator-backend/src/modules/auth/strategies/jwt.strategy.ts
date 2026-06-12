import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../database/models/user.model';
import { Role } from '../../../database/models/role.model';
import { ERROR_CODES } from '../../../common/constants/error-codes';

export interface JwtPayload {
  sub: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel.findByPk(payload.sub, {
      include: [Role],
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user) {
      throw new UnauthorizedException({
        errorCode: 'AUTH_002',
        message: ERROR_CODES.AUTH_002,
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException({
        errorCode: 'AUTH_004',
        message: ERROR_CODES.AUTH_004,
      });
    }

    const roleName = (user.role as Role)?.name;
    return {
      sub: user.id,
      email: user.email,
      role: roleName,
    };
  }
}
