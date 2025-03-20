import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth.routes';
import questionRoutes from './routes/question.routes';
import categoryRoutes from './routes/category.routes';
import tagRoutes from './routes/tag.routes';
import statisticsRoutes from './routes/statistics.routes';
import healthRouter from './routes/health';

// 创建Express应用
const app = express();

// 连接数据库
mongoose.connect(config.mongodb.uri)
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((error) => {
    console.error('数据库连接失败:', error);
    process.exit(1);
  });

// 中间件
app.use(helmet()); // 安全头
app.use(compression()); // 压缩响应
app.use(cors()); // 跨域
app.use(morgan('dev')); // 日志
app.use(express.json()); // 解析JSON
app.use(express.urlencoded({ extended: true })); // 解析URL编码

// 路由
app.use('/', healthRouter);
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/statistics', statisticsRoutes);

// 错误处理
app.use(errorHandler);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '未找到请求的资源'
  });
});

export { app }; 