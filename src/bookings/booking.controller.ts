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
  UseInterceptors,
} from '@nestjs/common';

import { PaginationDto } from '../common/dto/pagination.dto';
import { BookingService } from './booking.service';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateFeedbackDto } from '../feedbacks/dto/create-feedback.dto';
import { Roles } from '../common/decorators/role.decorator';
import { UserRoleEnum } from '../common/enums/role.enum';
import { MailService } from '../mail/mail.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly mailService: MailService,
  ) {} // here is DI

  @Roles(UserRoleEnum.ADMIN)
  @Get()
  @UseInterceptors(CacheInterceptor)
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
  @UseInterceptors(CacheInterceptor)
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
  @UseInterceptors(CacheInterceptor)
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
    @Req() req: any,
    @Param('bookingId') bookingId: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    try {
      const userId = req.user.userId;
      const { status, message, userEmail } =
        await this.bookingService.updateBooking(
          +userId,
          +bookingId,
          updateBookingDto,
        );

      await this.mailService.sendMail(
        userEmail,
        'Booking Status Update – User Notification',
        `Hello,

This is to inform you that the status of your booking has been updated in our system.

1. Booking ID: ${bookingId}
2. Updated Status: ${updateBookingDto.status}

Please review the update and ensure everything is in order. If you have any questions or need assistance, feel free to contact our support team.

Thank you for choosing Car Rental Service.

Kind regards,
Car Rental Service Team
`,
        '',
      );

      return { status, message };
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
