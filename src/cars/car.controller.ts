import {
  Controller,
  HttpCode,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Param,
  Body,
  Post,
  Req,
} from '@nestjs/common';
import { CarService } from './car.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CarFilterDto } from './dto/car-filter.dto';
import { CreateBookingDto } from '../bookings/dto/create-booking.dto';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {} // here is DI

  @Get()
  @HttpCode(200)
  async getAllCar(
    @Query() query: PaginationDto,
    @Query() carFilterDto: CarFilterDto,
  ) {
    try {
      const result = await this.carService.getAllCar(query, carFilterDto);
      console.log(result);
      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':carId/bookings')
  @HttpCode(201)
  async addBooking(
    @Req() req: any,
    @Param('carId') carId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    try {
      const userId = req.user.userId;
      return await this.carService.addBooking(
        +userId,
        +carId,
        createBookingDto,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
