import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';
import { ERROR_MESSAGES } from '../constant/error-messages';

interface MappedError {
  status: number;
  message: string;
}

// Connection / engine level problems: the database is unreachable or busy.
const PRISMA_UNAVAILABLE_CODES = new Set([
  'P1000',
  'P1001',
  'P1002',
  'P1008',
  'P1017',
  'P2024',
]);

function mapPrismaError(exception: unknown): MappedError | null {
  if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: 'A record with the same unique value already exists',
        };
      case 'P2025':
        return { status: HttpStatus.NOT_FOUND, message: 'Record not found' };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message:
            'The operation references a related record that does not exist or is still in use',
        };
      case 'P2000':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'A provided value is too long',
        };
      case 'P2023':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid identifier or value format',
        };
      default:
        if (PRISMA_UNAVAILABLE_CODES.has(exception.code)) {
          return {
            status: HttpStatus.SERVICE_UNAVAILABLE,
            message: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
          };
        }
        return null;
    }
  }

  if (
    exception instanceof Prisma.PrismaClientInitializationError ||
    exception instanceof Prisma.PrismaClientRustPanicError
  ) {
    return {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
    };
  }

  if (exception instanceof Prisma.PrismaClientValidationError) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: ERROR_MESSAGES.VALIDATION_FAILED,
    };
  }

  return null;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const body =
        typeof payload === 'string'
          ? { statusCode: status, message: payload }
          : payload;
      res.status(status).json(body);
      return;
    }

    const mapped = mapPrismaError(exception);
    if (mapped) {
      if (mapped.status >= 500) {
        this.logger.error(
          exception instanceof Error ? exception.stack : String(exception),
        );
      }
      res
        .status(mapped.status)
        .json({ statusCode: mapped.status, message: mapped.message });
      return;
    }

    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception),
    );

    const message = this.toUserMessage(exception);
    const status =
      message === ERROR_MESSAGES.SERVICE_UNAVAILABLE
        ? HttpStatus.SERVICE_UNAVAILABLE
        : HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({
      statusCode: status,
      message,
    });
  }

  private toUserMessage(exception: unknown): string {
    const raw =
      exception instanceof Error
        ? exception.message
        : typeof exception === 'string'
          ? exception
          : '';
    const lower = raw.toLowerCase();

    if (
      lower.includes('econnrefused') ||
      lower.includes('p1001') ||
      lower.includes("can't reach database server")
    ) {
      return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
    }

    return ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }
}
