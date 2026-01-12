import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'rating must be a number' })
  @Min(1)
  @Max(5)
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  readonly description: string;
}
