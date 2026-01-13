import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CarStatus } from '../../cars/enums/car-status.enum';

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
  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  color: string;

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

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  month: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  year: number;
}
