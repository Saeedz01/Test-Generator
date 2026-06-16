import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
      }
    
      handleRequest<TUser = unknown>(err: Error | null, user: TUser): TUser {
        if (err || !user) {
          throw new UnauthorizedException({
            message: ERROR_MESSAGES.INVALID_CREDENTIALS,
          });
        }
        return user;
      }
}