import { Expose } from 'class-transformer';
import { CarStatus } from '../enums/car-status.enum';

export class CarResponseDto {
  @Expose()
  id: number;

  @Expose()
  brand: string;

  @Expose()
  model: string;

  @Expose()
  pricePerHour: number;

  @Expose()
  status: CarStatus;
}
