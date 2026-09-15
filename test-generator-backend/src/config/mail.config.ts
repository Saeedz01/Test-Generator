import { registerAs } from '@nestjs/config';

function parseMailEnabled(value: string | undefined): boolean {
  const normalized = String(value ?? 'true').toLowerCase().trim();
  return !['false', '0', 'no', 'off'].includes(normalized);
}

function parseMailSecure(value: string | undefined, port: number): boolean {
  if (value !== undefined) {
    return value.toLowerCase().trim() === 'true';
  }

  return port === 465;
}

export default registerAs('mail', () => {
  const port = parseInt(process.env.MAIL_PORT || '587', 10);
  const rawPassword = process.env.MAIL_PASSWORD ?? '';

  return {
    enabled: parseMailEnabled(process.env.MAIL_ENABLED),
    host: process.env.MAIL_HOST,
    port,
    secure: parseMailSecure(process.env.MAIL_SECURE, port),
    user: process.env.MAIL_USER || process.env.MAIL_USERNAME,
    // Gmail app passwords may be pasted with spaces; SMTP expects them removed.
    password: rawPassword.replace(/\s+/g, ''),
    from: process.env.MAIL_FROM || 'Testora <noreply@localhost>',
  };
});
