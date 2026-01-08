import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  HttpException,
  Req,
} from '@nestjs/common';

import type { Response } from 'express';
import { AuthService } from './auth.service';
import { getCookieOptions } from './helpers/cookie.helper';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly authService: AuthService) {} // here is DI

  @Post('register')
  @HttpCode(201)
  async userRegister(@Body() createUserDto: CreateUserDto) {
    return await this.authService.userRegister(createUserDto);
  }
  @Post('login')
  @HttpCode(200)
  async userLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const result = await this.authService.userLogin(createUserDto);

      res.cookie('accessToken', result.accessToken, getCookieOptions);
      res.cookie('refreshToken', result.refreshToken, getCookieOptions);

      return result;
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }
  @Post('logout')
  async userLogout(@Req() req: Request) {
    try {
      const result = await this.authService.userLogout(req);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }
}
