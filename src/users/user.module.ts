import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { UserAddress } from './entities/user-address.entity';
import { Address } from './entities/address.entity';
import { City } from '../cities/entities/city.entity';
import { Country } from '../countries/entities/country.entity';
import { State } from '../states/entities/state.entity';
import { UserAddressController } from './user-address.controller';
import { UserAddressService } from './user-address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole,
      Role,
      UserAddress,
      Address,
      City,
      Country,
      State,
    ]),
  ],
  controllers: [UserController, UserAddressController],
  providers: [UserService, UserAddressService],
})
export class UserModule {}
