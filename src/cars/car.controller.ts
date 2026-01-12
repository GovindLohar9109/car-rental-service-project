import {
  Controller,
  HttpCode,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CarService } from './car.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CarFilterDto } from './dto/car-filter.dto';

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
}
