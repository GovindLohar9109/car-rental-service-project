import {
  Controller,
  HttpCode,
  Get,
  HttpException,
  Query,
  Param,
  Body,
  Post,
  Req,
} from '@nestjs/common';
import { CarService } from './car.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateBookingDto } from '../bookings/dto/create-booking.dto';
import { MailService } from '../mail/mail.service';
import { Roles } from '../common/decorators/role.decorator';
import { UserRoleEnum } from '../common/enums/role.enum';

@Controller('cars')
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly mailService: MailService,
  ) {} // here is DI

  @Get()
  @HttpCode(200)
  async getAllCar(@Query() query: PaginationDto) {
    try {
      const result = await this.carService.getAllCar(query);

      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Roles(UserRoleEnum.USER)
  @Post(':carId/bookings')
  @HttpCode(201)
  async addBooking(
    @Req() req: any,
    @Param('carId') carId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    try {
      const userId = req.user.userId;

      const { status, message, userEmail, ownerEmail } =
        await this.carService.addBooking(+userId, +carId, createBookingDto);

      // sending to user who booked car
      const startDate = new Date(createBookingDto.startDate);
      const endDate = new Date(createBookingDto.endDate);
      await this.mailService.sendMail(
        ownerEmail,
        'Car Booking Confirmation',
        `
      Hello,

      Thank you for choosing our Car Rental Service!

      We are pleased to confirm your booking with the following details:

      1. Car ID: ${carId}
      2. Booking Period: ${startDate} to ${endDate}

      Please ensure you carry a valid driving license and ID at the time of pickup.
      If you have any questions or need assistance, feel free to contact our support team.

      We wish you a safe and pleasant journey!

      Best regards,
      Car Rental Service Team
        `,
        '',
      );

      //sending to car owner
      await this.mailService.sendMail(
        ownerEmail,
        'Your Car Has Been Booked',
        `
      Hello,

      We would like to inform you that your car has been successfully booked.

      1. Car ID: ${carId}
      2. Booked By: ${userEmail}
      3. Booking Period: ${startDate} to ${endDate}

      Please make sure the car is available and in good condition for the scheduled booking period.

      Thank you for being a valued partner with us.

      Warm regards,
      Car Rental Service Team
        `,
        '',
      );

      return { status, message };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
