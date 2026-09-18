import { registerAs } from '@nestjs/config';
import { randomBytes } from 'crypto';

// Secrets are validated at boot by src/config/env.validation.ts.
function jwtSecret(name: string): string {
  const value = process.env[name]?.trim();
  if (value) {
    return value;
  }
  // Random per-process secrets are only acceptable for automated tests.
  if (process.env.NODE_ENV === 'test') {
    return randomBytes(32).toString('hex');
  }
  throw new Error(`${name} is required (generate with: openssl rand -hex 32)`);
}

function corsOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (process.env.NODE_ENV === 'production') {
    if (!raw) {
      throw new Error('CORS_ORIGINS is required in production');
    }
  }
  return (raw || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function cookieSameSite(): 'lax' | 'strict' | 'none' {
  const value = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
  if (value === 'strict' || value === 'none' || value === 'lax') {
    return value;
  }
  return 'lax';
}

/**
 * Express "trust proxy" setting. Defaults to 1 hop (one reverse proxy /
 * load balancer in front of the API). Use 0/false when the API is exposed
 * directly, otherwise clients can spoof X-Forwarded-For and dodge rate limits.
 */
export function trustProxySetting(
  raw = process.env.TRUST_PROXY,
): boolean | number | string {
  const value = raw?.trim();
  if (!value) {
    return 1;
  }
  if (/^false$/i.test(value)) {
    return false;
  }
  if (/^true$/i.test(value)) {
    return true;
  }
  if (/^\d+$/.test(value)) {
    const hops = parseInt(value, 10);
    return hops === 0 ? false : hops;
  }
  return value;
}

function positiveInt(raw: string | undefined, fallback: number): number {
  const parsed = parseInt(raw ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  trustProxy: trustProxySetting(),
  jwt: {
    accessSecret: jwtSecret('JWT_ACCESS_SECRET'),
    refreshSecret: jwtSecret('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  otp: {
    expiresInMinutes: positiveInt(process.env.OTP_EXPIRES_IN_MINUTES, 5),
  },
  cookie: {
    sameSite: cookieSameSite(),
    domain: process.env.COOKIE_DOMAIN?.trim() || undefined,
  },
  throttle: {
    ttlMs: positiveInt(process.env.THROTTLE_TTL_MS, 60_000),
    limit: positiveInt(process.env.THROTTLE_LIMIT, 300),
  },
  cors: {
    origins: corsOrigins(),
  },
}));
