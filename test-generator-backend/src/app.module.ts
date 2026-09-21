import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './modules/questions/questions.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { ClassModule } from './modules/class/class.module';
import { BookModule } from './modules/book/book.module';
import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import { validateEnv } from './config/env.validation';
import { MailModule } from './modules/mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './modules/search/search.module';
import { TrustedOriginMiddleware } from './common/middleware/trusted-origin.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Compiled output lives in dist/ (dist/app.module.js) and sources in
      // src/, so "<dir>/../.env" is the project root in both dev and prod.
      // Real environment variables always take precedence over the file.
      envFilePath: path.join(__dirname, '..', '.env'),
      load: [appConfig, mailConfig],
      validate: validateEnv,
    }),
    // Global per-IP default (generous: schools often share one NAT'd IP).
    // Auth routes keep their own strict @Throttle limits. Storage is
    // in-memory, i.e. per process; see README for multi-instance notes.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('app.throttle.ttlMs') ?? 60_000,
          limit: configService.get<number>('app.throttle.limit') ?? 300,
        },
      ],
    }),
    PrismaModule,
    MailModule,
    BookModule,
    ClassModule,
    ChapterModule,
    UserModule,
    AdminModule,
    AuthModule,
    QuestionsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TrustedOriginMiddleware,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrustedOriginMiddleware).forRoutes('*');
  }
}
