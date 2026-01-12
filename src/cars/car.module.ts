import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { UserAddress } from '../users/entities/user-address.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingHistory } from '../bookings/entities/booking-history';
import { MailModule } from '../mail/main.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, UserAddress, Booking, BookingHistory, User]),
    MailModule,
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
