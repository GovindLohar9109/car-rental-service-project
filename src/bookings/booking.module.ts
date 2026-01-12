import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingHistory } from './entities/booking-history';
import { Car } from '../cars/entities/car.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { MailModule } from 'src/mail/main.module';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    TypeOrmModule.forFeature([Booking, BookingHistory, Car, Feedback, User]),
    MailModule,
  ],
})
export class BookingModule {}
