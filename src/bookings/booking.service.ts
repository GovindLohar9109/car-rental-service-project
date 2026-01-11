import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingHistory } from '../bookings/entities/booking-history';
import { Car } from '../cars/entities/car.entity';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './enums/booking.enum';
import { CarStatus } from '../cars/enums/car-status.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingHistory)
    private readonly bookingHistoryRepository: Repository<BookingHistory>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async getAllBookings(paginationDto: PaginationDto) {
    let { page, limit } = paginationDto;

    try {
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const skipRows = (page - 1) * limit;

      const [bookings, totalRecords] = await this.bookingRepository
        .createQueryBuilder('booking')
        .innerJoinAndSelect('booking.car', 'car')
        .innerJoinAndSelect('booking.user', 'user')
        .limit(limit)
        .skip(skipRows)
        .getManyAndCount();

      const totalPages = Math.ceil(totalRecords / limit);
      const result = {
        status: true,
        data: bookings,
        totalBookings: totalRecords,
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

  async getOneBookingAllHistories(
    bookingId: number,
    paginationDto: PaginationDto,
  ) {
    let { page, limit } = paginationDto;

    try {
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const skipRows = (page - 1) * limit;
      const [bookings, totalRecords] =
        await this.bookingHistoryRepository.findAndCount({
          where: { booking: { id: bookingId } },
        });

      const totalPages = Math.ceil(totalRecords / limit);

      const result = {
        status: true,
        data: bookings,
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

  async getBookingDetails(bookingId: number) {
    try {
      const booking = await this.bookingRepository
        .createQueryBuilder('booking')
        .innerJoinAndSelect('booking.car', 'car')
        .innerJoinAndSelect('booking.user', 'user')
        .where('booking.id = :bookingId', { bookingId: bookingId })
        .getOne();

      return {
        status: true,
        data: booking,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBooking(bookingId: number, updateBookingDto: UpdateBookingDto) {
    try {
      //updaing booking status
      await this.bookingRepository.update(
        { id: bookingId },
        { ...updateBookingDto },
      );

      const existBooking = await this.bookingRepository.findOne({
        where: { id: bookingId },
        relations: ['user', 'car'],
      });
      const newHistory: object = {
        booking: { id: bookingId },
        user: { id: existBooking.user.id },
        car: { id: existBooking.car.id },
        totalAmount: existBooking.totalAmount,
        startDate: existBooking.startDate,
        endDate: existBooking.endDate,
        status: existBooking.status,
      };

      //

      // // //updating booking history status
      await this.bookingHistoryRepository.save(
        this.bookingHistoryRepository.create(newHistory),
      );

      const carStatus =
        existBooking.status == BookingStatus.ONGOING
          ? CarStatus.BOOKED
          : CarStatus.AVAILABLE;

      await this.carRepository.update(
        { id: existBooking.car.id },
        { status: carStatus },
      );

      return { status: true, message: 'Booking  updated...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeBooking(bookingId: number) {
    try {
      await this.bookingRepository.softDelete(bookingId);
      return { status: true, message: 'Booking deleted...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
