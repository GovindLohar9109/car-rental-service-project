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
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserAddressDto } from './dto/user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { CreateCarDto } from '../cars/dto/create-car.dto';
import { UpdateCarDto } from '../cars/dto/update-car.dto';
import { Roles } from '../common/decorators/role.decorator';
import { UserRoleEnum } from '../common/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {} // here is DI

  //----------------------------- USER  CONTROLLER METHODS ----------------------------

  @Get('me')
  @HttpCode(200)
  async getUser(@Req() req: any) {
    try {
      const userId = req.user.userId;
      return await this.userService.getUser(+userId);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.ADMIN)
  @Get()
  @HttpCode(200)
  async getAllUsers(@Query() query: PaginationDto) {
    try {
      const result = await this.userService.getAllUsers(query);
      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Patch()
  @HttpCode(200)
  async updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    try {
      const userId = req.user.userId;
      return this.userService.updateUser(userId, updateUserDto);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Delete()
  @HttpCode(200)
  async removeUser(@Req() req: any) {
    try {
      const userId = req.user.userId;
      return await this.userService.removeUser(+userId);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  //----------------------------- USER ADDRESS CONTROLLER METHODS ----------------------------

  @Post('addresses')
  @HttpCode(201)
  async addUserAddress(
    @Req() req: any,
    @Body() createUserAddressDto: CreateUserAddressDto,
  ) {
    try {
      const userId = req.user.userId;
      return await this.userService.addUserAddress(
        userId,
        createUserAddressDto,
      );
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('addresses/:addressId')
  @HttpCode(200)
  async getUserAddress(@Req() req: any, @Param('addressId') addressId: string) {
    try {
      const userId = req.user.userId;
      return await this.userService.getUserAddress(+userId, +addressId);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('addresses')
  @HttpCode(200)
  async getUserAllAddresses(@Req() req: any, @Query() query: PaginationDto) {
    try {
      const userId = req.user.userId;
      const result = await this.userService.getUserAllAddresses(+userId, query);
      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Patch('addresses/:addressId')
  @HttpCode(200)
  async updateUserAddress(
    @Param('addressId') addressId: string,
    @Body() UpdateUserAddressDto: UpdateUserAddressDto,
  ) {
    try {
      return this.userService.updateUserAddress(
        +addressId,
        UpdateUserAddressDto,
      );
    } catch (err) {
      throw new HttpException(err.message, err.status);
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
      return await this.userService.removeUserAddress(+userId, +addressId);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  //----------------------------- CAR CONTROLLER METHODS ----------------------------

  @Roles(UserRoleEnum.CAR_OWNER)
  @Post('cars')
  @HttpCode(201)
  async addCar(@Req() req: any, @Body() createCarDto: CreateCarDto) {
    try {
      const userId = req.user.userId;
      return await this.userService.addCar(+userId, createCarDto);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('cars/:carId')
  @HttpCode(200)
  async getCarDetails(@Param('carId') carId: string) {
    try {
      return await this.userService.getCarDetails(+carId);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CAR_OWNER)
  @Get('cars')
  @HttpCode(200)
  async getUserAllCars(@Req() req: any, @Query() query: PaginationDto) {
    try {
      const userId = req.user.userId;
      return await this.userService.getUserAllCars(userId, query);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.CAR_OWNER)
  @Patch('cars/:carId')
  @HttpCode(200)
  async updateCar(
    @Param('carId') carId: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    try {
      return this.userService.updateCar(+carId, updateCarDto);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.CAR_OWNER, UserRoleEnum.ADMIN)
  @Delete('cars/:carId')
  @HttpCode(200)
  async removeCar(@Param('carId') carId: string) {
    try {
      return await this.userService.removeCar(+carId);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
