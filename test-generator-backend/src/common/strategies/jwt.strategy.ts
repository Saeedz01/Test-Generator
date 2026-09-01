import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { User } from '../../modules/user/entities/user.entity';
import { TokenPayload } from '../../modules/auth/interfaces/auth.interface';


// when app starts then this strategy is registered in passport registry with the name 'jwt', we can set any name for the strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      // if you want to fetch the token from the header then use this
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // if you want to fetch the token from the cookies then use this
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('app.jwt.accessSecret'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role_id'],
      select: {
        id: true,
        email: true,
        name: true,
        isSuspended: true,
        // role: true,
        role_id: {
          role_name: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (user.isSuspended) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCOUNT_SUSPENDED);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      // role: user.role_id?.role_name ?? user.role,
      role: user.role_id?.role_name,
    };
  }
}
