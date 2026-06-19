import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Global()
@Module({
  imports: [ MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailerOptions => {
        const enabled = configService.get<boolean>('mail.enabled', true);
        const from = configService.getOrThrow<string>('mail.from');
        const template = {
          dir: join(__dirname, '..', '..', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        };

        if (!enabled) {
          return {
            transport: { jsonTransport: true },
            defaults: { from },
            template,
          };
        }

        const host = configService.get<string>('mail.host');
        const user = configService.get<string>('mail.user');
        const password = configService.get<string>('mail.password');
        const isProduction = configService.get<string>('app.nodeEnv') === 'production';

        if (isProduction && (!host || !user || !password)) {
          throw new Error(
            'Mail configuration incomplete: MAIL_HOST, MAIL_USER, and MAIL_PASSWORD are required in production.',
          );
        }

        if (!host) {
          return {
            transport: { jsonTransport: true },
            defaults: { from },
            template,
          };
        }

        const transport: SMTPTransport.Options = {
          host,
          port: configService.get<number>('mail.port', 587),
          secure: configService.get<boolean>('mail.secure', false),
          auth:
            user && password
              ? {
                  user,
                  pass: password,
                }
              : undefined,
        };

        return {
          transport,
          defaults: { from },
          template,
        };
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
