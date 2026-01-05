import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { UserAddressesModule } from './user-addresses/user-addresses.module';
import { CarsModule } from './cars/cars.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [HealthModule, UsersModule, CarsModule, UserAddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
