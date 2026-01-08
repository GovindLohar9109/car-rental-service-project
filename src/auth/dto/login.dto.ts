import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
export class LoginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  readonly email: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @IsInt()
  readonly roleId: number;
}
