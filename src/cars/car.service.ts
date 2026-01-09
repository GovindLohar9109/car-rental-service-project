import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { Car } from './entities/car.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async getAllCar(query: PaginationDto) {
    const { page, limit } = query;

    try {
      const skipRows = (page - 1) * limit;

      let [Cars, totalRecords] = await this.carRepository.findAndCount({
        take: limit,
        skip: skipRows,
      });

      const totalPages = Math.ceil(totalRecords / limit);
      return {
        status: true,
        data: Cars,
        pagination: { page, limit, totalPages },
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
