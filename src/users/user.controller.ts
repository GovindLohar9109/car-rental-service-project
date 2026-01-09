import {
  Controller,
  Body,
  Patch,
  Delete,
  HttpCode,
  Get,
  Query,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {} // here is DI

  @Get('me')
  @HttpCode(200)
  async getUser(@Req() req: any) {
    try {
      const userId = req.user.userId;
      return await this.userService.getUser(+userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(200)
  async getAllUsers(@Query() query: PaginationDto) {
    try {
      const result = await this.userService.getAllUsers(query);
      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch()
  @HttpCode(200)
  async updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    try {
      const userId = req.user.userId;
      return this.userService.updateUser(userId, updateUserDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete()
  @HttpCode(200)
  async removeUser(@Req() req: any) {
    try {
      const userId = req.user.userId;
      return await this.userService.removeUser(+userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
