import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  HttpException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from './auth.service';

import { JwtHelper } from './helpers/jwt.helper';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { RefreshResponseDto } from './dto/refreshResponse.dto';
import { Public } from '../common/decorators/public.decorator';
import { MailService } from 'src/mail/mail.service';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {} // here is DI

  @Post('register')
  @HttpCode(201)
  async userRegister(@Body() registerAuthDto: RegisterAuthDto) {
    try {
      const result = await this.authService.userRegister(registerAuthDto);
      await this.mailService.sendMail(
        registerAuthDto.email,
        'Welcome to Car Rental Service',
        'Your account has been created',
        `<h1>Welcome!</h1><p>Thanks for registering.</p>`,
      );
      result.message += 'and check your mail';
      return result;
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }
  @Post('login')
  @HttpCode(200)
  async userLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() loginAuthDto: LoginAuthDto,
  ): Promise<LoginResponseDto> {
    try {
      const result = await this.authService.userLogin(loginAuthDto);
      return result;
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Post('refresh')
  async refresh(@Req() req: Request): Promise<RefreshResponseDto> {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const refreshToken = authorization.split(' ')[1];

    try {
      const payload = await JwtHelper.verifyRefreshToken(refreshToken);

      const newAccessToken = await JwtHelper.generateAccessToken({
        userId: payload.userId as number,
        roleName: payload.roleName as string,
      });

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
