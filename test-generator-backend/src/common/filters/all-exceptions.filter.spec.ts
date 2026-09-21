import {
  ArgumentsHost,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ERROR_MESSAGES } from '../constant/error-messages';

function hostFor(req: Record<string, unknown> = {}) {
  const res: {
    statusCode: number;
    body: unknown;
    status: (code: number) => typeof res;
    json: (payload: unknown) => typeof res;
  } = {
    statusCode: 0,
    body: undefined,
    status: (code: number) => {
      res.statusCode = code;
      return res;
    },
    json: (payload: unknown) => {
      res.body = payload;
      return res;
    },
  };
  const host = {
    switchToHttp: () => ({
      getResponse: () => res,
      getRequest: () => req,
    }),
  } as unknown as ArgumentsHost;
  return { host, res };
}

describe('AllExceptionsFilter', () => {
  const filter = new AllExceptionsFilter();

  // The filter logs every server error; keep the test output clean.
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterAll(() => jest.restoreAllMocks());

  it('turns a missing column (pending migrations) into a clear 503', () => {
    const { host, res } = hostFor({ requestId: 'req-1', method: 'POST' });
    const error = new Prisma.PrismaClientKnownRequestError('boom', {
      code: 'P2022',
      clientVersion: 'test',
      meta: { column: 'user.otpLockedUntil' },
    });

    filter.catch(error, host);

    expect(res.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    expect(res.body).toMatchObject({
      message: ERROR_MESSAGES.SERVICE_NOT_READY,
      requestId: 'req-1',
    });
  });

  it('never leaks a Prisma message (it can contain query arguments)', () => {
    const { host, res } = hostFor();
    const error = new Prisma.PrismaClientKnownRequestError(
      'Invalid `prisma.user.update()` invocation: password: "$2b$12$secret"',
      { code: 'P2021', clientVersion: 'test' },
    );

    filter.catch(error, host);

    expect(JSON.stringify(res.body)).not.toContain('secret');
  });

  it('adds the request id to unexpected 500s only', () => {
    const { host, res } = hostFor({ requestId: 'req-2' });
    filter.catch(new Error('kaboom'), host);
    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.body).toMatchObject({
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      requestId: 'req-2',
    });

    const notFound = hostFor({ requestId: 'req-3' });
    filter.catch(new NotFoundException('Book not found'), notFound.host);
    expect(notFound.res.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(notFound.res.body).not.toHaveProperty('requestId');
  });
});
