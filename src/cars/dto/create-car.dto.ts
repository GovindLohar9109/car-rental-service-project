import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsTimeZone,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CarStatus } from '../enums/car-status.enum';
export class CreateCarDto {
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @MaxLength(254)
  readonly status: CarStatus;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @MaxLength(20)
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @MaxLength(50)
  readonly model: string;

  @IsString()
  readonly imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  @MaxLength(25)
  readonly color: string;

  @IsNumber()
  @Max(10)
  @Min(2)
  @IsNotEmpty()
  readonly totalSeat: number;

  @IsInt()
  @IsNotEmpty()
  readonly userId: number;

  @IsDate()
  @IsNotEmpty()
  readonly insuranceExpirationDate: Date;
}
