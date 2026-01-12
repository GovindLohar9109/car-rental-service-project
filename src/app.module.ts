import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { HealthModule } from './health/health.module';
import { UserModule } from './users/user.module';

import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './shared/middlewares/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { CarModule } from './cars/car.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true, // take entity from typeOrmModule.forFeature([]) and load here
      migrations: [],
    }),
    JwtModule.register({
      global: true,
      secret: 'secretKey',
    }),
    HealthModule,
    UserModule,
    AuthModule,
    CarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes('/*');
  }
}
