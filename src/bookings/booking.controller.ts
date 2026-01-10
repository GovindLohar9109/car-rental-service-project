import {
  Controller,
  HttpCode,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';

import { PaginationDto } from '../common/dto/pagination.dto';
import { BookingService } from './booking.service';
import { BookingFilterDto } from './dto/booking-filter.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {} // here is DI

  @Get()
  @HttpCode(200)
  async getAllBookings(
    @Query() query: PaginationDto,
    @Query() bookingFilterDto: BookingFilterDto,
  ) {
    try {
      const result = await this.bookingService.getAllBookings(
        query,
        bookingFilterDto,
      );

      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':bookingId/histories')
  @HttpCode(200)
  async getOneBookingAllHistories(
    @Param('bookingId') bookingId: string,
    @Query()
    query: PaginationDto,
    @Query() bookingFilterDto: BookingFilterDto,
  ) {
    try {
      const result = await this.bookingService.getOneBookingAllHistories(
        +bookingId,
        query,
        bookingFilterDto,
      );

      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':bookingId')
  @HttpCode(200)
  async getBookingDetails(@Param('bookingId') bookingId: string) {
    try {
      const result = await this.bookingService.getBookingDetails(+bookingId);

      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Patch(':bookingId')
  @HttpCode(200)
  async updateBooking(
    @Param('bookingId') bookingId: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    try {
      return this.bookingService.updateBooking(+bookingId, updateBookingDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':bookingId')
  @HttpCode(200)
  async removeBooking(@Param('bookingId') bookingId: string) {
    try {
      return await this.bookingService.removeBooking(+bookingId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
