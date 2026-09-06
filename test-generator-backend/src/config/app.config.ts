import { registerAs } from '@nestjs/config';
import { randomBytes } from 'crypto';

function jwtSecret(name: string): string {
  const value = process.env[name]?.trim();
  if (value) {
    if (process.env.NODE_ENV === 'production' && value.length < 32) {
      throw new Error(`${name} must be at least 32 characters`);
    }
    return value;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} is required`);
  }
  return randomBytes(32).toString('hex');
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

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    accessSecret: jwtSecret('JWT_ACCESS_SECRET'),
    refreshSecret: jwtSecret('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  otp: {
    expiresInMinutes: parseInt(process.env.OTP_EXPIRES_IN_MINUTES || '5', 10),
  },
  cookie: {
    sameSite: cookieSameSite(),
  },
  cache: {
    statsTtl: 300,
    listTtl: 600,
  },
  cors: {
    origins: corsOrigins(),
  },
}));
