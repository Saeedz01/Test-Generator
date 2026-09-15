import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ERROR_MESSAGES } from '../constant/error-messages';

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

    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception),
    );

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: this.toUserMessage(exception),
    });
  }

  private toUserMessage(exception: unknown): string {
    const raw =
      exception instanceof Error ? exception.message : String(exception ?? '');
    const lower = raw.toLowerCase();

    if (
      lower.includes('prisma') ||
      lower.includes('does not exist') ||
      lower.includes('column') ||
      lower.includes('relation') ||
      lower.includes('database') ||
      lower.includes('econnrefused') ||
      lower.includes('p1001') ||
      lower.includes('p2022')
    ) {
      return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
    }

    return ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }
}
