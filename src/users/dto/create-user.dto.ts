import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  readonly email: string;

  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  @MaxLength(20)
  readonly phone: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @IsInt()
  readonly roleId: number;
}
