import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserAddressDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  readonly addressLine: string;

  @IsInt()
  @IsNotEmpty()
  readonly countryId: number;

  @IsInt()
  @IsNotEmpty()
  readonly stateId: number;

  @IsInt()
  @IsNotEmpty()
  readonly cityId: number;

  @IsString()
  @MaxLength(15)
  @MinLength(2)
  @IsNotEmpty()
  readonly zip: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(15)
  readonly tag: string;
}
