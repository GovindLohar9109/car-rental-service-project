import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingHistory } from './entities/booking-history';
import { Car } from '../cars/entities/car.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [TypeOrmModule.forFeature([Booking, BookingHistory, Car, Feedback])],
})
export class BookingModule {}
