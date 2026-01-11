import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CarStatus } from 'src/cars/enums/car-status.enum';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number) // it convert string to number like page='2' to page=2
  @IsInt({ message: 'Page number must be an integer' })
  @Min(1, { message: 'Page number must be greater than 0.' })
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit number must be an integer' })
  @Min(1, { message: 'Limit number must be greater than 0' })
  limit: number;

  @IsOptional()
  @IsString()
  status: CarStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  locationId: number;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;
}
