import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'X-Request-Id';
// Accept an upstream (proxy / load balancer) id only if it looks like one.
const SAFE_REQUEST_ID = /^[A-Za-z0-9._:-]{8,128}$/;
const QUIET_PATHS = new Set(['/', '/health']);

export type RequestWithContext = Request & {
  requestId?: string;
  user?: { id?: string };
};

/**
 * Loggable request context. Deliberately excludes the query string, headers,
 * cookies and body, which can carry emails, passwords, OTPs or tokens.
 */
export function requestContext(req: RequestWithContext) {
  const route = (req.route as { path?: string } | undefined)?.path;
  return {
    requestId: req.requestId ?? null,
    method: req.method,
    path: (req.originalUrl ?? req.url ?? '').split('?')[0],
    ...(route ? { route } : {}),
    userId: req.user?.id ?? null,
  };
}

/**
 * Assigns every request an id (echoed in the X-Request-Id response header
 * and in 5xx error bodies, so a user-reported error can be found in the
 * logs) and writes one structured access-log entry when the response ends.
 */
export function requestLogger() {
  const logger = new Logger('HTTP');

  return (req: RequestWithContext, res: Response, next: NextFunction) => {
    const incoming = req.get(REQUEST_ID_HEADER);
    req.requestId =
      incoming && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
    res.setHeader(REQUEST_ID_HEADER, req.requestId);

    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
      const status = res.statusCode;
      if (req.method === 'OPTIONS') {
        return;
      }
      // Health checks from uptime monitors are only interesting when failing.
      if (QUIET_PATHS.has(req.path) && status < 400) {
        return;
      }
      const entry = {
        event: 'http.request',
        ...requestContext(req),
        status,
        durationMs: Math.round(
          Number(process.hrtime.bigint() - startedAt) / 1e6,
        ),
        ip: req.ip,
      };
      if (status >= 500) {
        logger.error(entry);
      } else {
        logger.log(entry);
      }
    });

    next();
  };
}
