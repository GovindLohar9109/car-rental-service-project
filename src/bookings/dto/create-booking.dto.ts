import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BookingStatus } from '../enums/booking.enum';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  readonly endDate: Date;

  @IsNotEmpty()
  @IsNumber()
  readonly totalAmount: number;

  @IsNotEmpty()
  @IsString()
  readonly status: BookingStatus;
}
