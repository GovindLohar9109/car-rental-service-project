import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {} // here is DI

  @Get('me')
  @HttpCode(200)
  async getUser(@Req() req: any) {
    const userId = req.user.userId;

    const result = await this.userService.getUser(+userId);

    return {
      status: result.status,
      data: plainToInstance(UserResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get()
  @HttpCode(200)
  async getAllUsers(@Query() query: PaginationDto) {
    const result = await this.userService.getAllUsers(query);
    return result;
  }

  @Patch(':userId')
  @HttpCode(200)
  async updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(204) //no content
  async removeUser(@Param('userId') userId: string) {
    return await this.userService.removeUser(+userId);
  }
}
