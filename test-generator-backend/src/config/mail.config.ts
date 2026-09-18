import { registerAs } from '@nestjs/config';
import { isMailEnabled } from './env.validation';

function parseMailSecure(value: string | undefined, port: number): boolean {
  if (value !== undefined && value.trim() !== '') {
    return value.toLowerCase().trim() === 'true';
  }

  return port === 465;
}

export default registerAs('mail', () => {
  const port = parseInt(process.env.MAIL_PORT || '587', 10);
  const rawPassword = process.env.MAIL_PASSWORD ?? '';

  return {
    // Defaults to true in production (where it is mandatory) and false elsewhere.
    enabled: isMailEnabled(process.env.MAIL_ENABLED, process.env.NODE_ENV),
    host: process.env.MAIL_HOST,
    port,
    secure: parseMailSecure(process.env.MAIL_SECURE, port),
    user: process.env.MAIL_USER || process.env.MAIL_USERNAME,
    // Gmail app passwords may be pasted with spaces; SMTP expects them removed.
    password: rawPassword.replace(/\s+/g, ''),
    from: process.env.MAIL_FROM || 'Testora <noreply@localhost>',
  };
});
