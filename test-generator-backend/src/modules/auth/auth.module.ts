import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [UserService, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d',},
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
