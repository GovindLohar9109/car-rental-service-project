import {
  Controller,
  Body,
  HttpCode,
  Get,
  Req,
  HttpException,
  HttpStatus,
  Post,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';

import { CreateUserAddressDto } from './dto/user-address.dto';
import { UserAddressService } from './user-address.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Controller('users')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {} // here is DI

  @Post('addresses')
  @HttpCode(201)
  async addUserAddress(
    @Req() req: any,
    @Body() createUserAddressDto: CreateUserAddressDto,
  ) {
    try {
      const userId = req.user.userId;
      return await this.userAddressService.addUserAddress(
        userId,
        createUserAddressDto,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('addresses/:addressId')
  @HttpCode(200)
  async getUserAddress(@Req() req: any, @Param('addressId') addressId: string) {
    try {
      const userId = req.user.userId;
      return await this.userAddressService.getUserAddress(+userId, +addressId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('addresses')
  @HttpCode(200)
  async getUserAllAddresses(@Req() req: any, @Query() query: PaginationDto) {
    try {
      const userId = req.user.userId;
      const result = await this.userAddressService.getUserAllAddresses(
        +userId,
        query,
      );
      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('addresses/:addressId')
  @HttpCode(200)
  async updateUserAddress(
    @Param('addressId') addressId: string,
    @Body() UpdateUserAddressDto: UpdateUserAddressDto,
  ) {
    try {
      return this.userAddressService.updateUserAddress(
        +addressId,
        UpdateUserAddressDto,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('addresses/:addressId')
  @HttpCode(200)
  async removeUserAddress(
    @Req() req: any,
    @Param('addressId') addressId: string,
  ) {
    try {
      const userId = req.user.userId;
      return await this.userAddressService.removeUserAddress(
        +userId,
        +addressId,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
