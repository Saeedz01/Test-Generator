import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class TrustedOriginMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    if (!MUTATING.has(req.method.toUpperCase())) {
      next();
      return;
    }

    const cookie = req.headers.cookie ?? '';
    const hasAuthCookie =
      cookie.includes('access_token=') || cookie.includes('refresh_token=');
    if (!hasAuthCookie) {
      next();
      return;
    }

    const allowed =
      this.configService.get<string[]>('app.cors.origins') ?? [];
    const origin = this.requestOrigin(req);
    if (origin && allowed.includes(origin)) {
      next();
      return;
    }

    throw new ForbiddenException('Invalid request origin');
  }

  private requestOrigin(req: Request): string | null {
    if (req.headers.origin) {
      return req.headers.origin;
    }
    const referer = req.headers.referer;
    if (!referer) {
      return null;
    }
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }
}
