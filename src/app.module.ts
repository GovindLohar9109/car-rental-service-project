import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
import { HealthModule } from './health/health.module';
import { UserModule } from './users/user.module';

import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { CarModule } from './cars/car.module';
import { BookingModule } from './bookings/booking.module';
import { FeedbackModule } from './feedbacks/feedback.module';
import { AuthGuard } from './common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/role.guard';
import { MailModule } from './mail/main.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UploadController } from './upload/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from './upload/cloudinary.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './src/uploads',
    }),
    CacheModule.register({ isGlobal: true }),
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
      secret: 'jwtConstants.secret',
    }),
    HealthModule,
    UserModule,
    AuthModule,
    CarModule,
    BookingModule,
    FeedbackModule,
    MailModule,
  ],
  controllers: [UploadController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    CloudinaryService,
  ],
})
export class AppModule {}

// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .exclude(
//         { path: 'auth/login', method: RequestMethod.POST },
//         { path: 'auth/register', method: RequestMethod.POST },
//         { path: 'auth/refresh', method: RequestMethod.POST },
//       )
//       .forRoutes('/*');
//   }
// }
