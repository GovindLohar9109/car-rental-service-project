import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @Expose()
  status: boolean;

  @Expose()
  message: string;

  @Expose()
  roleName: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
