import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: isProduction
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug'],
  });
  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('app.cors.origins') ?? [];
  const port = configService.get<number>('app.port') ?? 5000;

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.use(
    helmet({
      hsts: isProduction
        ? { maxAge: 15552000, includeSubDomains: true, preload: false }
        : false,
    }),
  );
  app.use(cookieParser());
  app.use(json({ limit: '200kb' }));
  app.use(urlencoded({ extended: false, limit: '200kb' }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api', { exclude: ['/'] });

  await app.listen(port);
}
bootstrap();
