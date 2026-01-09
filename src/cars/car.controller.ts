import {
  Controller,
  Body,
  HttpCode,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CarService } from './car.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {} // here is DI

  @Get()
  @HttpCode(200)
  async getAllCar(@Param() query: PaginationDto) {
    try {
      return await this.carService.getAllCar(query);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
