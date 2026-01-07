import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { HealthModule } from './health/health.module';
import { dataSourceOptions } from './db/data-source';
import { StudentsModule } from './students/students.module';

dotenv.config();

@Module({
  imports: [HealthModule, TypeOrmModule.forRoot(dataSourceOptions), StudentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
