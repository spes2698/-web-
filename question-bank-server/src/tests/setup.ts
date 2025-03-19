import { afterAll, jest } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { config } from '../config';

// 加载测试环境变量
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

// 设置测试超时时间
jest.setTimeout(10000);

beforeAll(async () => {
  // 连接测试数据库
  await mongoose.connect(config.mongodb.uri);
});

afterAll(async () => {
  // 断开数据库连接
  await mongoose.connection.close();
});

afterEach(async () => {
  // 清理所有集合
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
}); 