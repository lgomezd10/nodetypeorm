import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export function verifyJwt(token: string): any {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (e) {
    throw e;
  }
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader?.replace('Bearer ', '') : <string>req.headers['auth'];
  let jwtPayload;

  try {
    jwtPayload = verifyJwt(token);
    res.locals.jwtPayload = jwtPayload;
  } catch (e) {
    console.log('JWT Error:', e);
    return res.status(401).json({ message: 'Not Authorized' });
  }

  const { userId, username } = jwtPayload;

  const newToken = jwt.sign({ userId, username }, config.jwtSecret, { expiresIn: '1h' });
  res.setHeader('token', newToken);
  next();
};