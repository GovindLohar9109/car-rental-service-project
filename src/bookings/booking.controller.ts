import {
  Controller,
  HttpCode,
  Get,
  HttpException,
  Query,
  Param,
  Body,
  Delete,
  Patch,
  Post,
  Req,
} from '@nestjs/common';

import { PaginationDto } from '../common/dto/pagination.dto';
import { BookingService } from './booking.service';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateFeedbackDto } from 'src/feedbacks/dto/create-feedback.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRoleEnum } from 'src/common/enums/role.enum';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {} // here is DI

  @Roles(UserRoleEnum.ADMIN)
  @Get()
  @HttpCode(200)
  async getAllBookings(@Query() query: PaginationDto) {
    try {
      const result = await this.bookingService.getAllBookings(query);

      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CAR_OWNER)
  @Get(':bookingId/histories')
  @HttpCode(200)
  async getOneBookingAllHistories(
    @Param('bookingId') bookingId: string,
    @Query()
    query: PaginationDto,
  ) {
    try {
      const result = await this.bookingService.getOneBookingAllHistories(
        +bookingId,
        query,
      );

      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CAR_OWNER)
  @Get(':bookingId')
  @HttpCode(200)
  async getBookingDetails(@Param('bookingId') bookingId: string) {
    try {
      const result = await this.bookingService.getBookingDetails(+bookingId);

      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.CAR_OWNER)
  @Patch(':bookingId')
  @HttpCode(200)
  async updateBooking(
    @Param('bookingId') bookingId: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    try {
      return this.bookingService.updateBooking(+bookingId, updateBookingDto);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':bookingId')
  @HttpCode(200)
  async removeBooking(@Param('bookingId') bookingId: string) {
    try {
      return await this.bookingService.removeBooking(+bookingId);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.USER)
  @Post(':bookingId/feedbacks')
  @HttpCode(201)
  async addFeedback(
    @Req() req: any,
    @Param('bookingId') bookingId: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    try {
      const userId = req.user.userId;
      return await this.bookingService.addFeedback(
        +userId,
        +bookingId,
        createFeedbackDto,
      );
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
