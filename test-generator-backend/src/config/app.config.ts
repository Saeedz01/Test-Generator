import { registerAs } from '@nestjs/config';

// function parseRedisEnabled(value: string | undefined): boolean {
//   const v = String(value ?? 'true').toLowerCase().trim();
//   if (['false', '0', 'no', 'off'].includes(v)) return false;
//   return true;
// }

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  otp: {
    expiresInMinutes: parseInt(process.env.OTP_EXPIRES_IN_MINUTES || '5', 10),
  },
  // redis: {
  //   enabled: parseRedisEnabled(process.env.REDIS_ENABLED),
  //   host: process.env.REDIS_HOST || 'localhost',
  //   port: parseInt(process.env.REDIS_PORT || '6379', 10),
  //   password: process.env.REDIS_PASSWORD || undefined,
  // },
  cache: {
    statsTtl: 300,
    listTtl: 600,
  },
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:5000')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  },
}));
