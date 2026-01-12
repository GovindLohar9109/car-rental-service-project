import {
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly model: string;

  @IsString()
  readonly imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  readonly color: string;

  @IsNumber()
  @Max(10)
  @Min(2)
  @IsNotEmpty()
  readonly totalSeat: number;

  @IsDateString()
  @IsNotEmpty()
  readonly insuranceExpirationDate: Date;
}
