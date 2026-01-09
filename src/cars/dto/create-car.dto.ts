import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

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
