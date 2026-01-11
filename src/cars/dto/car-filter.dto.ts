import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { CarStatus } from '../enums/car-status.enum';

export class CarFilterDto {
  @IsOptional()
  @IsString()
  status: CarStatus;

  @IsOptional()
  @IsInt()
  location: number;

  @IsOptional()
  @IsDateString()
  startDateTime: Date;

  @IsOptional()
  @IsDateString()
  endDateTime: Date;
}
