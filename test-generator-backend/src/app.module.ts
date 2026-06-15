import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './modules/questions/questions.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { ClassModule } from './modules/class/class.module';
import { BookModule } from './modules/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import path from 'path';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '1122',
      database: process.env.DB_NAME ?? 'test-generator',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    // configurations
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env'),
      load: [appConfig, /*databaseConfig, smtpConfig*/],
    }),
    BookModule, ClassModule, ChapterModule, UserModule, AdminModule, AuthModule, QuestionsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
