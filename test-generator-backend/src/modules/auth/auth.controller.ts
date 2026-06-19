import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
import ms from 'ms';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // @HttpCode(HttpStatus.OK)
  // async register(@Body() registerDto: CreateUserDto) {
  //   return this.authService.register(registerDto);
  // }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)   // After a login request, if we don’t set the status manually, NestJS sends 201 by default (as if a new resource was created), but here we force 200 OK because this is not creation, it’s just a login response
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);
    const isProduction = process.env.NODE_ENV === 'production';

    // syntax of res.cookie('TokenName', 'TokenValue', { options })
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      // maxAge: tokens.expiresIn * 1000,
      maxAge: ms(tokens.expiresIn) as unknown as number,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      // maxAge: tokens.refreshExpiresIn * 1000,
      maxAge: ms(tokens.refreshExpiresIn) as unknown as number,
    });

    return { user };
    
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Request password reset (mock)' })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(req.user.id, dto);
  }


  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
