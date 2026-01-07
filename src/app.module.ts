import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { HealthModule } from './health/health.module';
import { dataSourceOptions } from './db/data-source';

dotenv.config();

@Module({
  imports: [
    HealthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true, // take entity from typeOrmModule.forFeature([]) and load here
      migrations: ['src/migrations/*.ts'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
