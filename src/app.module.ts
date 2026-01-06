import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import HealthController from './health/health.controller';
import dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], // instead of we written autoLoadEntities:true
      autoLoadEntities: true, // take entity from typeOrmModule.forFeature([]) and load here
      synchronize: false,
      // if it is true then typeorm will talk to db schema if tables not present will create , update , add column ,drop ect
    } as TypeOrmModuleOptions),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
