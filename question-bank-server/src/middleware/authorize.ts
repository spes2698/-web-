import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('未授权访问', 401);
      }

      if (!roles.includes(req.user.role)) {
        throw new AppError('权限不足', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 