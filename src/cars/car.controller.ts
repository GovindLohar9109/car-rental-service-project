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
import { UserRoleEnum } from 'src/common/enums/role.enum';

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
      const { status, message, userEmail } = await this.carService.addBooking(
        +userId,
        +carId,
        createBookingDto,
      );

      // sending to user who booked car
      const startDate = new Date(createBookingDto.startDate);
      const endDate = new Date(createBookingDto.endDate);
      await this.mailService.sendMail(
        userEmail,
        'Welcome to Car Rental Service',
        `Your car has been booked from 
          ${startDate} to 
          ${endDate}`,
        `<h1>Welcome!</h1><p>Thanks for booking.</p>`,
      );

      // //sending to car owner
      // await this.mailService.sendMail(
      //   ownerEmail,
      //   'Welcome to Car Owner  ',
      //   `Your car which id is ${carId} has been booked from by ${userEmail} from` +
      //     createBookingDto.startDate +
      //     ' to ' +
      //     createBookingDto.endDate,
      //   ``,
      // );
      return { status, message };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
