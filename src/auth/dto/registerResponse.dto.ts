import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  status: boolean;

  @Expose()
  message: string;
}
