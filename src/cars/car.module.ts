import { Module } from '@nestjs/common';
import { CarsService } from './car.service';
import { CarsController } from './car.controller';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
