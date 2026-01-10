import { HttpException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { Car } from './entities/car.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CarFilterDto } from './dto/car-filter.dto';
import { CarStatus } from './enums/car-status.enum';
import { UserAddress } from '../users/entities/user-address.entity';
import { CreateBookingDto } from '../bookings/dto/create-booking.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingHistory } from '../bookings/entities/booking-history';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingHistory)
    private readonly bookingHistoryRepository: Repository<BookingHistory>,
  ) {}

  async getAllCar(query: PaginationDto, carFilterDto: CarFilterDto) {
    let { page, limit } = query;

    try {
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const skipRows = (page - 1) * limit;

      const qb = this.userAddressRepository
        .createQueryBuilder('ua')
        .innerJoin('ua.address', 'address')
        .innerJoin('ua.user', 'user')
        .select('user.id', 'userId');

      if (carFilterDto.location) {
        qb.andWhere('address.id = :addressId', {
          addressId: carFilterDto.location,
        });
      }

      let users = await qb.getRawMany();
      users = users.flatMap((user) => user.userId);

      const whereCondition = [
        { status: carFilterDto.status ?? CarStatus.AVAILABLE },
        { user: { id: In(users) } },
      ];

      const [cars, totalRecords] = await this.carRepository.findAndCount({
        where: whereCondition,
        take: limit,
        skip: skipRows,
      });

      const totalPages = Math.ceil(totalRecords / limit);

      const result = {
        status: true,
        data: cars,

        pagination: { page, limit, totalPages },
      };

      return result;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addBooking(
    userId: number,
    carId: number,
    createBookingDto: CreateBookingDto,
  ) {
    try {
      const bookingData: object = {
        user: { id: userId },
        car: { id: carId },
        totalAmount: createBookingDto.totalAmount,
        startDate: createBookingDto.startDate,
        endDate: createBookingDto.endDate,
        status: createBookingDto.status,
      };
      const newBooking = this.bookingRepository.create(bookingData);

      await this.bookingRepository.save(bookingData);
      await this.bookingHistoryRepository.save({
        booking: { id: newBooking.id },
        ...newBooking,
      });

      return { status: true, message: 'Car is booked ...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
