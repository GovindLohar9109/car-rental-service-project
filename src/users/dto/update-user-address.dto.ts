import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAddressDto } from './user-address.dto';

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {}
