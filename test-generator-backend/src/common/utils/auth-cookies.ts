import type { CookieOptions, Response } from 'express';
import type { AuthTokens } from '../../modules/auth/interfaces/auth.interface';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

/**
 * The refresh token is only ever needed by POST /api/auth/refresh and
 * POST /api/auth/logout, so it is scoped to that path and is not sent with
 * every other API request.
 */
export const REFRESH_COOKIE_PATH = '/api/auth';

export function authCookieOptions(
  maxAgeMs?: number,
  path = '/',
): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSiteEnv = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
  const sameSite =
    sameSiteEnv === 'strict' || sameSiteEnv === 'none' ? sameSiteEnv : 'lax';
  const secure = isProduction || sameSite === 'none';
  // Optional parent domain (e.g. "example.com") so an API on api.example.com
  // and a frontend on example.com / www.example.com share the cookies.
  const domain = process.env.COOKIE_DOMAIN?.trim() || undefined;

  return {
    httpOnly: true,
    secure,
    sameSite,
    path,
    ...(domain ? { domain } : {}),
    ...(typeof maxAgeMs === 'number' ? { maxAge: maxAgeMs } : {}),
  };
}

/** Older builds stored the refresh cookie on path "/"; remove that copy. */
function clearLegacyRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN_COOKIE, authCookieOptions(undefined, '/'));
}

export function setAuthCookies(res: Response, tokens: AuthTokens) {
  res.cookie(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    authCookieOptions(tokens.expiresIn * 1000),
  );
  // During the refresh grace window only a new access token is issued; the
  // browser keeps the refresh cookie set by the request that rotated it.
  if (tokens.refreshToken) {
    clearLegacyRefreshCookie(res);
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      authCookieOptions(tokens.refreshExpiresIn * 1000, REFRESH_COOKIE_PATH),
    );
  }
}

export function clearAuthCookies(res: Response) {
  // Must use the same path/domain the cookies were set with.
  res.clearCookie(ACCESS_TOKEN_COOKIE, authCookieOptions());
  res.clearCookie(
    REFRESH_TOKEN_COOKIE,
    authCookieOptions(undefined, REFRESH_COOKIE_PATH),
  );
  clearLegacyRefreshCookie(res);
}
