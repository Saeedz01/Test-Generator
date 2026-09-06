import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './modules/questions/questions.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { ClassModule } from './modules/class/class.module';
import { BookModule } from './modules/book/book.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import { MailModule } from './modules/mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import path from 'path';
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
  providers: [AppService],
})

export class AppModule {}
