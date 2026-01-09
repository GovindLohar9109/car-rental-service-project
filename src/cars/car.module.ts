import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { UserAddress } from 'src/users/entities/user-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, UserAddress])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
