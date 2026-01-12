import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

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
}
