import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from '../user/entities/user.entity';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from 'src/common/utils/auth-cookies';

function cookieValue(req: Request, name: string): string | undefined {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const value = cookies?.[name];
  return typeof value === 'string' && value ? value : undefined;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      loginDto,
      req.get('user-agent'),
    );
    if ('requiresOtp' in result) {
      return result;
    }

    setAuthCookies(res, result.tokens);
    return { user: result.user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request & { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('confirm-reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  confirmResetPassword(@Body() dto: ConfirmResetPasswordDto) {
    return this.authService.confirmResetPassword(dto);
  }

  /**
   * Change password (signed-in admin). Limited per client IP; roomy enough
   * for typos, tight enough to stop guessing the old password from a stolen
   * session. Success revokes every session, including this one, so the auth
   * cookies are cleared as well.
   */
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.resetPassword(req.user.id, dto);
    clearAuthCookies(res);
    return result;
  }

  /**
   * Public on purpose: must work with an expired access token. Revokes the
   * session referenced by the refresh (or access) cookie and always clears
   * the cookies. CSRF: TrustedOriginMiddleware rejects cross-origin mutating
   * requests that carry auth cookies.
   */
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      await this.authService.logout(
        cookieValue(req, REFRESH_TOKEN_COOKIE),
        cookieValue(req, ACCESS_TOKEN_COOKIE),
      );
    } finally {
      clearAuthCookies(res);
    }
    return { message: 'Logged out successfully' };
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(
      cookieValue(req, REFRESH_TOKEN_COOKIE),
    );
    setAuthCookies(res, tokens);
    return { ok: true };
  }

  @Get('admins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  listAdmins() {
    return this.authService.listAdmins();
  }

  @Post('admins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto.email, dto.password, dto.name);
  }

  @Patch('admins/:id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  suspendAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.toggleAdminSuspension(id);
  }

  @Delete('admins/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  deleteAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.deleteAdmin(id);
  }
}
