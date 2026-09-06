import type { CookieOptions, Response } from 'express';
import type { AuthTokens } from '../../modules/auth/interfaces/auth.interface';

export function authCookieOptions(maxAgeMs?: number): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSiteEnv = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
  const sameSite =
    sameSiteEnv === 'strict' || sameSiteEnv === 'none' ? sameSiteEnv : 'lax';
  const secure = isProduction || sameSite === 'none';

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    ...(typeof maxAgeMs === 'number' ? { maxAge: maxAgeMs } : {}),
  };
}

export function setAuthCookies(res: Response, tokens: AuthTokens) {
  res.cookie(
    'access_token',
    tokens.accessToken,
    authCookieOptions(tokens.expiresIn * 1000),
  );
  res.cookie(
    'refresh_token',
    tokens.refreshToken,
    authCookieOptions(tokens.refreshExpiresIn * 1000),
  );
}

export function clearAuthCookies(res: Response) {
  const options = authCookieOptions();
  res.clearCookie('access_token', options);
  res.clearCookie('refresh_token', options);
}
