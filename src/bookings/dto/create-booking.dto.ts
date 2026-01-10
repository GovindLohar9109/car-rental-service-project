import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BookingStatus } from '../enums/booking.enum';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDate()
  readonly startDate: Date;

  @IsDate()
  @IsNotEmpty()
  readonly endDate: Date;

  @IsNotEmpty()
  @IsNumber()
  readonly totalAmount: number;

  @IsNotEmpty()
  @IsString()
  readonly status: BookingStatus;
}
