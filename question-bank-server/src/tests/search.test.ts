import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { Question } from '../models/question';
import { Category } from '../models/category';
import { Tag } from '../models/tag';
import { User } from '../models/user';
import { generateToken } from '../utils/auth';

describe('搜索功能测试', () => {
  let authToken: string;
  let categoryId: string;
  let tagId: string;

  beforeEach(async () => {
    // 创建测试用户
    const user = await User.create({
      phone: '13800138000',
      role: 'user'
    });
    authToken = generateToken(user._id);

    // 创建测试分类
    const category = await Category.create({
      name: '数学',
      description: '数学相关题目'
    });
    categoryId = category._id.toString();

    // 创建测试标签
    const tag = await Tag.create({
      name: '基础题',
      color: '#ff0000'
    });
    tagId = tag._id.toString();

    // 创建测试题目
    await Question.create([
      {
        title: '1+1等于多少？',
        content: '请计算1+1的结果',
        answer: '2',
        analysis: '这是最基础的加法运算',
        category: categoryId,
        difficulty: 'easy',
        tags: [tagId]
      },
      {
        title: '2+2等于多少？',
        content: '请计算2+2的结果',
        answer: '4',
        analysis: '这是基础的加法运算',
        category: categoryId,
        difficulty: 'medium',
        tags: [tagId]
      }
    ]);
  });

  describe('题目搜索', () => {
    it('应该能够通过关键词搜索题目', async () => {
      const response = await request(app)
        .get('/api/questions/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ keyword: '1+1' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].title).toContain('1+1');
    });

    it('应该能够通过分类筛选题目', async () => {
      const response = await request(app)
        .get('/api/questions/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ category: categoryId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].category).toBe(categoryId);
    });

    it('应该能够通过难度筛选题目', async () => {
      const response = await request(app)
        .get('/api/questions/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ difficulty: 'easy' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].difficulty).toBe('easy');
    });

    it('应该能够通过标签筛选题目', async () => {
      const response = await request(app)
        .get('/api/questions/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ tags: tagId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].tags).toContain(tagId);
    });

    it('应该支持组合筛选', async () => {
      const response = await request(app)
        .get('/api/questions/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          category: categoryId,
          difficulty: 'easy',
          tags: tagId
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].category).toBe(categoryId);
      expect(response.body.data[0].difficulty).toBe('easy');
      expect(response.body.data[0].tags).toContain(tagId);
    });
  });
}); 