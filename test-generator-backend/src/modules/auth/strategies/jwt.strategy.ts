import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { User } from '../../user/entities/user.entity';
import { TokenPayload } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
        role: true,
        role_id: {
          role_name: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role_id?.role_name ?? user.role,
    };
  }
}
