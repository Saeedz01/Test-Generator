import { validateEnv } from './env.validation';

const ACCESS =
  '3f9a1c7e5b2d4f8a6c0e9b1d7f3a5c2e8b4d6f0a1c3e5b7d9f2a4c6e8b0d1f3a';
const REFRESH =
  'a7c2e9f1b3d5c8e0f4a6b2d9c1e7f3a5b8d0c4e6f2a9b1d3c5e7f0a8b6d2c4e1';

function base(overrides: Record<string, string | undefined> = {}) {
  return {
    NODE_ENV: 'development',
    DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
    JWT_ACCESS_SECRET: ACCESS,
    JWT_REFRESH_SECRET: REFRESH,
    ...overrides,
  };
}

const production = (overrides: Record<string, string | undefined> = {}) =>
  base({
    NODE_ENV: 'production',
    CORS_ORIGINS: 'https://app.example.com',
    MAIL_ENABLED: 'true',
    MAIL_HOST: 'smtp.example.com',
    MAIL_USER: 'mailer',
    MAIL_PASSWORD: 'pw',
    MAIL_FROM: 'Testora <noreply@example.com>',
    ...overrides,
  });

describe('validateEnv', () => {
  it('accepts a minimal valid development config', () => {
    expect(() => validateEnv(base())).not.toThrow();
  });

  it('accepts a complete production config', () => {
    expect(() => validateEnv(production())).not.toThrow();
  });

  it('rejects unknown NODE_ENV values', () => {
    expect(() => validateEnv(base({ NODE_ENV: 'staging' }))).toThrow(
      /NODE_ENV/,
    );
  });

  it('requires DATABASE_URL', () => {
    expect(() => validateEnv(base({ DATABASE_URL: undefined }))).toThrow(
      /DATABASE_URL/,
    );
  });

  it('requires JWT secrets outside tests', () => {
    expect(() => validateEnv(base({ JWT_ACCESS_SECRET: undefined }))).toThrow(
      /JWT_ACCESS_SECRET is required/,
    );
    expect(() =>
      validateEnv(
        base({
          NODE_ENV: 'test',
          JWT_ACCESS_SECRET: undefined,
          JWT_REFRESH_SECRET: undefined,
        }),
      ),
    ).not.toThrow();
  });

  it('rejects short, low-entropy or identical secrets', () => {
    expect(() => validateEnv(base({ JWT_ACCESS_SECRET: 'short' }))).toThrow(
      /at least 32/,
    );
    expect(() =>
      validateEnv(base({ JWT_ACCESS_SECRET: 'ab'.repeat(20) })),
    ).toThrow(/low-entropy/);
    expect(() => validateEnv(base({ JWT_REFRESH_SECRET: ACCESS }))).toThrow(
      /must be different/,
    );
  });

  it('rejects placeholder secrets only in production', () => {
    const placeholder = 'my-super-secret-key-change-me-0123456789';
    expect(() =>
      validateEnv(base({ JWT_ACCESS_SECRET: placeholder })),
    ).not.toThrow();
    expect(() =>
      validateEnv(production({ JWT_ACCESS_SECRET: placeholder })),
    ).toThrow(/placeholder/);
  });

  it('requires CORS_ORIGINS in production and validates origins', () => {
    expect(() => validateEnv(production({ CORS_ORIGINS: undefined }))).toThrow(
      /CORS_ORIGINS is required/,
    );
    expect(() =>
      validateEnv(base({ CORS_ORIGINS: 'https://app.example.com/' })),
    ).toThrow(/bare origins/);
  });

  it('refuses to start production with mail disabled', () => {
    expect(() => validateEnv(production({ MAIL_ENABLED: 'false' }))).toThrow(
      /MAIL_ENABLED must be true in production/,
    );
  });

  it('requires mail settings when mail is enabled', () => {
    expect(() =>
      validateEnv(base({ MAIL_ENABLED: 'true', MAIL_HOST: 'smtp.x.com' })),
    ).toThrow(/MAIL_USER.*\n.*MAIL_PASSWORD/s);
  });

  it('validates TRUST_PROXY and COOKIE_DOMAIN', () => {
    expect(() => validateEnv(base({ TRUST_PROXY: '2' }))).not.toThrow();
    expect(() => validateEnv(base({ TRUST_PROXY: 'false' }))).not.toThrow();
    expect(() => validateEnv(base({ TRUST_PROXY: 'yes please' }))).toThrow(
      /TRUST_PROXY/,
    );
    expect(() =>
      validateEnv(base({ COOKIE_DOMAIN: 'https://example.com' })),
    ).toThrow(/COOKIE_DOMAIN/);
  });
});
