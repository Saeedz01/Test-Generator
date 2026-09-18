import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    logger: isProduction
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug'],
  });
  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('app.cors.origins') ?? [];
  const port = configService.get<number>('app.port') ?? 5000;

  // Hops of trusted reverse proxies (TRUST_PROXY); drives req.ip for rate limiting.
  app.set(
    'trust proxy',
    configService.get<boolean | number | string>('app.trustProxy') ?? 1,
  );

  app.use(
    helmet({
      hsts: isProduction
        ? { maxAge: 15552000, includeSubDomains: true, preload: false }
        : false,
    }),
  );
  app.use(cookieParser());
  // JSON only: no urlencoded parser, so plain HTML form posts (a classic
  // login-CSRF vector) are never parsed into a request body.
  app.use(json({ limit: '200kb' }));
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

  app.setGlobalPrefix('api', { exclude: ['/', '/health'] });
  app.enableShutdownHooks();

  await app.listen(port);
  Logger.log(`API listening on port ${port}`, 'Bootstrap');
}

bootstrap().catch((error: unknown) => {
  const message =
    error instanceof Error ? (error.stack ?? error.message) : String(error);
  Logger.error(`Failed to start application: ${message}`, 'Bootstrap');
  process.exit(1);
});
