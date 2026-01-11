import { HttpException, Injectable } from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { Car } from './entities/car.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

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

  async getAllCar(paginationDto: PaginationDto) {
    let { page, limit } = paginationDto;

    try {
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const skipRows = (page - 1) * limit;

      const qb = this.userAddressRepository
        .createQueryBuilder('ua')
        .innerJoin('ua.address', 'address')
        .innerJoin('ua.user', 'user')
        .select('user.id', 'userId')
        .limit(limit)
        .skip(skipRows);

      if (paginationDto.locationId) {
        qb.andWhere('address.id = :addressId', {
          addressId: paginationDto.locationId,
        });
      }

      let users = await qb.getRawMany();
      users = users.flatMap((user) => user.userId);

      // validation on startDate and endDate
      /*.
        1. Start Date must be at least 1 hour more then current date
        2. StartDate and End Date difference must be at least 3 hour
        3. StartDate must be less then endDate
      
       */
      const ONE_HOUR = 60 * 60 * 1000;
      const THREE_HOURS = 3 * ONE_HOUR;

      const now = Date.now();

      const reqStartDate = paginationDto.startDate
        ? new Date(paginationDto.startDate)
        : new Date(now + ONE_HOUR);

      const reqEndDate = paginationDto.endDate
        ? new Date(paginationDto.endDate)
        : new Date(now + 5 * ONE_HOUR);

      if (reqEndDate <= reqStartDate) {
        throw new HttpException(
          'endDate must be greater than startDate',
          HttpStatus.BAD_REQUEST,
        );
      }

      const durationMs = reqEndDate.getTime() - reqStartDate.getTime();

      if (durationMs < THREE_HOURS) {
        throw new HttpException(
          'Booking duration must be at least 3 hours',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (reqStartDate.getTime() < now + ONE_HOUR) {
        throw new HttpException(
          'startDate must be at least 1 hour after current time',
          HttpStatus.BAD_REQUEST,
        );
      }

      //getting all booking which are overlapping
      const notAvailableBookings = await this.bookingRepository
        .createQueryBuilder('b')
        .where('b.startDate < :reqEndDate AND b.endDate > :reqStartDate', {
          reqStartDate,
          reqEndDate,
        })
        .getRawMany();

      const notAvailableCarIds = notAvailableBookings.map(
        (booking) => booking.b_car_id,
      );

      const whereCondition = {
        status: paginationDto.status ?? CarStatus.AVAILABLE,
        user: { id: In(users) },
        id: Not(In(notAvailableCarIds)),
      };

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

      const savedBooking = await this.bookingRepository.save(bookingData);
      const newBookingHistory = this.bookingHistoryRepository.create({
        booking: { id: savedBooking.id },
        ...newBooking,
      });

      await this.bookingHistoryRepository.save(newBookingHistory);

      return { status: true, message: 'Car is booked ...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
