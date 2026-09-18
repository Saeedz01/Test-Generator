import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    logout: jest.fn(),
    refreshToken: jest.fn(),
  };

  function mockResponse() {
    return {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response & {
      cookie: jest.Mock;
      clearCookie: jest.Mock;
    };
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('logout revokes via cookies and always clears them', async () => {
    authService.logout.mockRejectedValue(new Error('db down'));
    const res = mockResponse();
    const req = {
      cookies: { refresh_token: 'r', access_token: 'a' },
    } as unknown as Request;

    await expect(controller.logout(req, res)).rejects.toThrow('db down');
    expect(authService.logout).toHaveBeenCalledWith('r', 'a');
    const cleared = res.clearCookie.mock.calls.map(
      ([name, options]: [string, { path: string }]) =>
        `${name}:${options.path}`,
    );
    expect(cleared).toEqual(
      expect.arrayContaining([
        'access_token:/',
        'refresh_token:/api/auth',
        'refresh_token:/',
      ]),
    );
  });

  it('refresh keeps the existing refresh cookie during the grace window', async () => {
    authService.refreshToken.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: undefined,
      expiresIn: 900,
      refreshExpiresIn: 604800,
    });
    const res = mockResponse();
    await controller.refresh(
      { cookies: { refresh_token: 'r' } } as unknown as Request,
      res,
    );
    const names = res.cookie.mock.calls.map(([name]: [string]) => name);
    expect(names).toEqual(['access_token']);
  });

  it('refresh sets the rotated refresh cookie on its scoped path', async () => {
    authService.refreshToken.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      expiresIn: 900,
      refreshExpiresIn: 604800,
    });
    const res = mockResponse();
    await controller.refresh(
      { cookies: { refresh_token: 'r' } } as unknown as Request,
      res,
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'new-refresh',
      expect.objectContaining({ path: '/api/auth', httpOnly: true }),
    );
  });
});
