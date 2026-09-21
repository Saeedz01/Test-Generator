import { Logger } from '@nestjs/common';

/**
 * Boot-time environment validation (wired into ConfigModule.forRoot({ validate })).
 * Collects every problem and fails fast with a single readable error so a
 * misconfigured deployment never starts half-working.
 */

const NODE_ENVS = ['development', 'production', 'test'] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];

const MIN_JWT_SECRET_LENGTH = 32;
const MIN_JWT_SECRET_DISTINCT_CHARS = 10;
const PLACEHOLDER_SECRET =
  /change|secret|example|password|placeholder|default|your[-_]?/i;
const DURATION = /^\d+[smhd]$/;

type Env = Record<string, unknown>;

function str(env: Env, key: string): string {
  const value = env[key];
  return typeof value === 'string' ? value.trim() : '';
}

export function parseBooleanEnv(
  value: string | undefined,
  fallback: boolean,
): boolean {
  const normalized = String(value ?? '')
    .toLowerCase()
    .trim();
  if (!normalized) {
    return fallback;
  }
  return !['false', '0', 'no', 'off'].includes(normalized);
}

export function resolveNodeEnv(value: string | undefined): NodeEnv {
  const normalized = (value ?? '').trim();
  return (NODE_ENVS as readonly string[]).includes(normalized)
    ? (normalized as NodeEnv)
    : 'development';
}

/** MAIL_ENABLED defaults to true in production and false elsewhere. */
export function isMailEnabled(
  value: string | undefined,
  nodeEnv: string | undefined,
): boolean {
  return parseBooleanEnv(value, resolveNodeEnv(nodeEnv) === 'production');
}

function isPositiveInt(value: string): boolean {
  return /^\d+$/.test(value) && parseInt(value, 10) > 0;
}

function validateOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.origin === origin
    );
  } catch {
    return false;
  }
}

function isLocalHostname(hostname: string): boolean {
  return ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
}

function validateTrustProxy(value: string): boolean {
  if (/^(true|false)$/i.test(value) || /^\d+$/.test(value)) {
    return true;
  }
  // Comma-separated express "trust proxy" values: loopback, linklocal,
  // uniquelocal, IPs or CIDR subnets.
  return value
    .split(',')
    .map((part) => part.trim())
    .every((part) => /^[a-z0-9.:/]+$/i.test(part));
}

export function validateEnv(config: Env): Env {
  const errors: string[] = [];
  const warnings: string[] = [];

  // No silent default: a production server that forgot NODE_ENV would
  // otherwise run with development settings (no Secure cookies, no HSTS,
  // relaxed secret/mail checks).
  const rawNodeEnv = str(config, 'NODE_ENV');
  if (!rawNodeEnv) {
    errors.push(
      `NODE_ENV is required (one of ${NODE_ENVS.join('|')}); use NODE_ENV=production on servers`,
    );
  } else if (!(NODE_ENVS as readonly string[]).includes(rawNodeEnv)) {
    errors.push(
      `NODE_ENV must be one of ${NODE_ENVS.join('|')} (got "${rawNodeEnv}")`,
    );
  }
  const nodeEnv = resolveNodeEnv(rawNodeEnv);
  const isProduction = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';

  const databaseUrl = str(config, 'DATABASE_URL');
  if (!databaseUrl) {
    errors.push('DATABASE_URL is required');
  } else if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
    errors.push('DATABASE_URL must be a postgresql:// connection string');
  } else if (
    isProduction &&
    /USER:PASSWORD@|\/DB_NAME(\?|$)/.test(databaseUrl)
  ) {
    errors.push(
      'DATABASE_URL still contains the .env.example placeholders (USER:PASSWORD / DB_NAME)',
    );
  }

  // --- JWT -----------------------------------------------------------------
  const access = str(config, 'JWT_ACCESS_SECRET');
  const refresh = str(config, 'JWT_REFRESH_SECRET');
  for (const [key, value] of [
    ['JWT_ACCESS_SECRET', access],
    ['JWT_REFRESH_SECRET', refresh],
  ] as const) {
    if (!value) {
      if (!isTest) {
        errors.push(
          `${key} is required (generate one with: openssl rand -hex 32)`,
        );
      }
      continue;
    }
    if (value.length < MIN_JWT_SECRET_LENGTH) {
      errors.push(
        `${key} must be at least ${MIN_JWT_SECRET_LENGTH} characters (openssl rand -hex 32)`,
      );
    }
    if (new Set(value).size < MIN_JWT_SECRET_DISTINCT_CHARS) {
      errors.push(`${key} looks low-entropy; use openssl rand -hex 32`);
    }
    if (PLACEHOLDER_SECRET.test(value)) {
      const message = `${key} looks like a placeholder/human-chosen value; use openssl rand -hex 32`;
      if (isProduction) {
        errors.push(message);
      } else {
        warnings.push(message);
      }
    }
  }
  if (access && refresh && access === refresh) {
    errors.push('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different');
  }
  for (const key of ['JWT_ACCESS_EXPIRES_IN', 'JWT_REFRESH_EXPIRES_IN']) {
    const value = str(config, key);
    if (value && !DURATION.test(value)) {
      errors.push(`${key} must look like 15m, 12h or 7d (got "${value}")`);
    }
  }

  // --- HTTP ----------------------------------------------------------------
  const port = str(config, 'PORT');
  if (port && !isPositiveInt(port)) {
    errors.push('PORT must be a positive integer');
  }

  const cors = str(config, 'CORS_ORIGINS');
  if (!cors && isProduction) {
    errors.push(
      'CORS_ORIGINS is required in production (comma-separated frontend origins)',
    );
  }
  if (cors) {
    const invalid = cors
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
      .filter((origin) => !validateOrigin(origin));
    if (invalid.length) {
      errors.push(
        `CORS_ORIGINS entries must be bare origins like https://app.example.com (invalid: ${invalid.join(', ')})`,
      );
    } else if (isProduction) {
      // Production auth cookies are Secure, so an http:// frontend could
      // never sign in; localhost stays allowed for local production builds.
      const insecure = cors
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        .filter((origin) => {
          const url = new URL(origin);
          return url.protocol !== 'https:' && !isLocalHostname(url.hostname);
        });
      if (insecure.length) {
        errors.push(
          `CORS_ORIGINS must use https:// in production (invalid: ${insecure.join(', ')})`,
        );
      }
    }
  }

  const sameSite = str(config, 'COOKIE_SAMESITE').toLowerCase();
  if (sameSite && !['lax', 'strict', 'none'].includes(sameSite)) {
    errors.push('COOKIE_SAMESITE must be one of lax|strict|none');
  }

  const cookieDomain = str(config, 'COOKIE_DOMAIN');
  if (cookieDomain && !/^\.?[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(cookieDomain)) {
    errors.push(
      'COOKIE_DOMAIN must be a bare domain such as example.com (no scheme, port or path)',
    );
  }

  // TRUST_PROXY decides which client IP rate limits see. Production must
  // state it explicitly for the real topology, and "true" (trust every
  // X-Forwarded-For hop, i.e. client-controlled IPs) is never accepted there.
  const trustProxy = str(config, 'TRUST_PROXY');
  if (trustProxy && !validateTrustProxy(trustProxy)) {
    errors.push(
      'TRUST_PROXY must be false, true, a hop count (e.g. 1) or a comma-separated list of IPs/subnets',
    );
  } else if (isProduction && !trustProxy) {
    errors.push(
      'TRUST_PROXY is required in production: the number of reverse proxies in front of the API (e.g. 1), their IPs/subnets, or false if clients connect directly',
    );
  } else if (isProduction && /^true$/i.test(trustProxy)) {
    errors.push(
      'TRUST_PROXY=true lets clients spoof their IP via X-Forwarded-For; use a hop count or proxy IPs/subnets in production',
    );
  }

  for (const key of ['THROTTLE_LIMIT', 'THROTTLE_TTL_MS']) {
    const value = str(config, key);
    if (value && !isPositiveInt(value)) {
      errors.push(`${key} must be a positive integer`);
    }
  }

  const otpMinutes = str(config, 'OTP_EXPIRES_IN_MINUTES');
  if (
    otpMinutes &&
    (!isPositiveInt(otpMinutes) || parseInt(otpMinutes, 10) > 60)
  ) {
    errors.push('OTP_EXPIRES_IN_MINUTES must be an integer between 1 and 60');
  }

  // --- Mail ----------------------------------------------------------------
  const mailEnabled = isMailEnabled(str(config, 'MAIL_ENABLED'), nodeEnv);
  if (isProduction && !mailEnabled) {
    errors.push(
      'MAIL_ENABLED must be true in production (login OTPs and reset codes are delivered by email)',
    );
  }
  if (mailEnabled) {
    if (!str(config, 'MAIL_HOST')) {
      errors.push('MAIL_HOST is required when MAIL_ENABLED=true');
    }
    if (!str(config, 'MAIL_USER') && !str(config, 'MAIL_USERNAME')) {
      errors.push(
        'MAIL_USER (or MAIL_USERNAME) is required when MAIL_ENABLED=true',
      );
    }
    if (!str(config, 'MAIL_PASSWORD')) {
      errors.push('MAIL_PASSWORD is required when MAIL_ENABLED=true');
    }
    const mailPort = str(config, 'MAIL_PORT');
    if (mailPort && !isPositiveInt(mailPort)) {
      errors.push('MAIL_PORT must be a positive integer');
    }
    if (isProduction && !str(config, 'MAIL_FROM')) {
      errors.push('MAIL_FROM is required in production');
    } else if (
      isProduction &&
      /@example\.(com|org|net)\b/i.test(str(config, 'MAIL_FROM'))
    ) {
      errors.push(
        'MAIL_FROM still uses the example.com placeholder; set your real sender address',
      );
    }
  }

  if (warnings.length) {
    const logger = new Logger('EnvValidation');
    for (const warning of warnings) {
      logger.warn(warning);
    }
  }

  if (errors.length) {
    throw new Error(
      `Invalid environment configuration:\n  - ${errors.join('\n  - ')}`,
    );
  }

  return config;
}
