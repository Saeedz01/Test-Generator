import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
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
import { MailModule } from './modules/mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrustedOriginMiddleware } from './common/middleware/trusted-origin.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env'),
      load: [appConfig, mailConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 30,
      },
    ]),
    PrismaModule,
    MailModule,
    BookModule,
    ClassModule,
    ChapterModule,
    UserModule,
    AdminModule,
    AuthModule,
    QuestionsModule,
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
