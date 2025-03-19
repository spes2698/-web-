import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // 处理Mongoose验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map(error => error.message).join(', ')
    });
  }

  // 处理Mongoose重复键错误
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    return res.status(400).json({
      success: false,
      message: '数据已存在'
    });
  }

  // 处理JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '无效的token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'token已过期'
    });
  }

  // 处理其他错误
  console.error(err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
}; 