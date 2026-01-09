import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { Car } from '../cars/entities/car.entity';

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
      Car,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
