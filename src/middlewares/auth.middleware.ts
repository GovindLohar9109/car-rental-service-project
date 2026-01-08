import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../helpers/jwt.helper';
import { getCookieOptions } from '../helpers/cookie.helper';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    try {
      if (!authorization) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const accessToken = authorization.split(' ')[1];
      if (!accessToken) {
        throw new HttpException(
          'Access token missing',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = verifyAccessToken(accessToken);
      req['user'] = payload;
      console.log(1);
      return next();
    } catch (err) {
      if (err.message === 'Access token missing') {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new HttpException(
          'Refresh token missing',
          HttpStatus.UNAUTHORIZED,
        );
      }

      try {
        const refreshPayload = verifyRefreshToken(refreshToken);
        console.log(1);
        const newAccessToken = generateAccessToken({
          userId: refreshPayload.userId,
          roleName: refreshPayload.roleName,
        });

        res.clearCookie('accessToken');

        res.cookie('accessToken', newAccessToken, getCookieOptions);

        req['user'] = refreshPayload;
        return next();
      } catch (error) {
        throw new HttpException(error?.message, error?.status);
      }
    }
  }
}
