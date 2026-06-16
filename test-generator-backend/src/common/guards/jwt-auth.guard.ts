import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';


//AuthGuard call the jwt strategy from the passport registry and validate the token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  // When a request arrives at a protected route, this method tells Passport
  // to start the JWT authentication process (extract token, verify it,
  // and run the JWT strategy). Without this, the authentication flow
  // would not begin.
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // After Passport finishes checking the JWT token and running the strategy,
  // it sends the result here. If authentication failed or no user was found,
  // we stop the request and return a custom Unauthorized error.
  // If everything is valid, we allow the request to continue with the user attached.
  handleRequest<TUser = unknown>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }
  // If everything is valid, the authenticated user is passed forward.
  // NestJS then attaches this user to req.user for the controller to use.
    return user;
  }
}