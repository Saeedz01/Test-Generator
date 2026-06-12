import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}


  
  async login(loginDto: LoginDto): Promise<{ payload: { userId: string, email: string, name: string }, token: string, res: Response }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    const payload = { userId: user.id, email: user.email, name: user.name };
    // const { accessToken, refreshToken, expiresIn } = await this.generateTokens(payload);
    // const token = this.jwtService.signAsync(payload);
    const token = this.jwtService.sign(payload);
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { payload, token, };
  }

  async verifyToken(token: string): Promise<{ userId: string } | undefined> {
    try {
      return this.jwtService.verify<{ userId: string }>(token) as { userId: string };
    } catch {
      return undefined;
    }}
  
  // async refreshToken(token: string): Promise<{ user: { id: string, email: string, name: string }, token: string }> {
  //   const decoded = this.verifyToken(token);
  //   if (!decoded) {
  //     throw new NotFoundException(ERROR_MESSAGES.INVALID_TOKEN);
  //   }
  //   const user = await this.userRepository.findOne({
  //     where: { id: decoded.userId },
  //   });
  //   if (!user) {
  //     throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
  //   }
  // }

  // private async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
  //   const accessSecret = this.configService.get<string>('app.jwt.accessSecret');
  //   const refreshSecret = this.configService.get<string>('app.jwt.refreshSecret');
  //   const accessExpires = this.configService.get<string>('app.jwt.accessExpiresIn');
  //   const refreshExpires = this.configService.get<string>('app.jwt.refreshExpiresIn');

  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.jwtService.signAsync(payload, {
  //       secret: accessSecret,
  //       expiresIn: accessExpires,
  //     }),
  //     this.jwtService.signAsync(payload, {
  //       secret: refreshSecret,
  //       expiresIn: refreshExpires,
  //     }),
  //   ]);

  //   // const expiresIn = 900;
  //   const expiresIn = this.parseTimeToSeconds(accessExpires);
  //   return {
  //     accessToken,
  //     refreshToken,
  //     expiresIn,
  //   };
  // }
  }