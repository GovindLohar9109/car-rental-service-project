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
import { CreateFeedbackDto } from 'src/feedbacks/dto/create-feedback.dto';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingHistory)
    private readonly bookingHistoryRepository: Repository<BookingHistory>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllBookings(queryDto: PaginationDto) {
    let { page = 1, limit = 10, month, year, status } = queryDto;

    try {
      // CASE 1:- All Month bookings of given year

      if (year && !month) {
        const rawData = await this.bookingRepository
          .createQueryBuilder('booking')
          .select('EXTRACT(MONTH FROM booking.createdAt)', 'month')
          .addSelect('COUNT(booking.id)', 'totalBookings')
          .addSelect('SUM(booking.totalAmount)', 'totalRevenue')
          .where('EXTRACT(YEAR FROM booking.createdAt) = :year', { year })
          .andWhere('booking.status =:status', { status })
          .groupBy('month')
          .orderBy('month', 'ASC')
          .getRawMany();

        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        const data = monthNames.map((name, index) => {
          const found = rawData.find((r) => Number(r.month) === index + 1);
          return {
            month: name,
            totalBookings: found ? Number(found.totalBookings) : 0,
            totalRevenue: found ? Number(found.totalRevenue) : 0,
          };
        });

        return {
          status: true,
          type: 'MONTHLY_SUMMARY',
          year,
          data,
        };
      }

      // CASE 2:- All Bookings or Month Filter

      const skipRows = (page - 1) * limit;

      const query = this.bookingRepository
        .createQueryBuilder('booking')
        .innerJoinAndSelect('booking.car', 'car')
        .innerJoinAndSelect('booking.user', 'user')
        .orderBy('booking.createdAt', 'DESC');

      if (status) {
        query.andWhere('booking.status =:status', { status });
      }
      if (month && year) {
        query.andWhere(
          `EXTRACT(MONTH FROM booking.createdAt) = :month
         AND EXTRACT(YEAR FROM booking.createdAt) = :year`,
          { month, year },
        );
      }

      const [bookings, totalRecords] = await query
        .skip(skipRows)
        .take(limit)
        .getManyAndCount();

      return {
        status: true,
        type: month && year ? 'MONTHLY_DETAILED' : 'ALL_BOOKINGS',
        totalBookings: totalRecords,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalRecords / limit),
        },
        data: bookings,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
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
          take: limit,
          skip: skipRows,
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

  async updateBooking(
    userId: number,
    bookingId: number,
    updateBookingDto: UpdateBookingDto,
  ) {
    try {
      //updating booking status
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
        totalAmount: Number(existBooking.totalAmount),
        startDate: existBooking.startDate,
        endDate: existBooking.endDate,
        status: existBooking.status,
      };

      //updating booking history status
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

      const userEmail = existBooking.user.email;
      return {
        status: true,
        message: 'Booking  updated...',
        userEmail,
      };
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

  async addFeedback(
    userId: number,
    bookingId: number,
    createFeedbackDto: CreateFeedbackDto,
  ) {
    try {
      const feedbackData: object = {
        user: { id: userId },
        booking: { id: bookingId },
        rating: createFeedbackDto.rating,
        description: createFeedbackDto.description,
      };

      const newFeedback = this.feedbackRepository.create(feedbackData);
      await this.feedbackRepository.save(newFeedback);

      return { status: true, message: 'Feedback is added ...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
