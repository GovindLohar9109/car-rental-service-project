import dotenv from 'dotenv';
import { CookieOptions } from 'express';
dotenv.config();
export const getCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  maxAge: 15 * 60 * 1000,
};
