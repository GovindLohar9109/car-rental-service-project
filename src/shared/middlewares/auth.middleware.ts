import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from '../../auth/helpers/jwt.helper';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    try {
      if (!authorization) {
        throw new UnauthorizedException();
      }
      const accessToken = authorization.split(' ')[1];
      if (!accessToken) {
        throw new UnauthorizedException('Access token missing');
      }

      const payload = JwtHelper.verifyAccessToken(accessToken);
      req['user'] = payload;

      return next();
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
