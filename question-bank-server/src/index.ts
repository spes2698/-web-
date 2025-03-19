import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler } from './middlewares/error';
import authRoutes from './routes/auth';
import logger from './utils/logger';
import { app } from './app';

const app = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);

// 错误处理
app.use(errorHandler);

// 数据库连接
mongoose.connect(config.mongodb.uri)
  .then(() => {
    logger.info('数据库连接成功');
  })
  .catch((err) => {
    logger.error('数据库连接失败:', err);
    process.exit(1);
  });

// 启动服务器
app.listen(config.port, () => {
  console.log(`服务器运行在 http://localhost:${config.port}`);
});

export default app; 