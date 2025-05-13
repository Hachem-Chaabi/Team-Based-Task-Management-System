import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import AsyncHandler from 'express-async-handler';
import { HttpCode } from '../utils/httpCode';
import JwtHelper from '../utils/jwtHelper';
import { TokenEnum } from '../constants/constants';
import userRepository from '../database/repositories/user.repository';
import { prisma } from '../database/config';

const Authenticated = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new ErrorHandler('Login first to access this resource.', HttpCode.UNAUTHORIZED));
  }

  const decoded = JwtHelper.ExtractToken(token, TokenEnum.access);

  if (!decoded || !decoded.id || !decoded.sessionId) {
    return next(new ErrorHandler('Invalid or expired token!', HttpCode.UNAUTHORIZED));
  }

  // Check if session still exists
  const session = await prisma.session.findUnique({
    where: { id: decoded.sessionId },
  });

  if (!session || session.userId !== decoded.id) {
    return next(new ErrorHandler('Session expired or invalid.', HttpCode.UNAUTHORIZED));
  }

  const user = await userRepository.getById(decoded.id);
  req.user = user;
  next();
});

export default { Authenticated };
