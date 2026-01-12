import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES,
} = process.env;

export class JwtHelper {
  static generateAccessToken(payload: object): string {
    const options: SignOptions = {
      expiresIn: JWT_ACCESS_EXPIRES as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, JWT_ACCESS_SECRET, options);
  }

  static generateRefreshToken(payload: object): string {
    const options: SignOptions = {
      expiresIn: JWT_REFRESH_EXPIRES as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
  }

  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  }

  static generateAccessAndRefreshToken(payload: object) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
