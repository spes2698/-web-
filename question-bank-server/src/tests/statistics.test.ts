import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { Question } from '../models/question';
import { Category } from '../models/category';
import { User } from '../models/user';
import { generateToken } from '../utils/auth';

describe('统计分析功能测试', () => {
  let adminToken: string;
  let categoryId: string;

  beforeEach(async () => {
    // 创建管理员用户
    const admin = await User.create({
      phone: '13800138000',
      role: 'admin'
    });
    adminToken = generateToken(admin._id);

    // 创建测试分类
    const category = await Category.create({
      name: '数学',
      description: '数学相关题目'
    });
    categoryId = category._id.toString();

    // 创建测试题目
    await Question.create([
      {
        title: '题目1',
        content: '内容1',
        answer: '答案1',
        analysis: '解析1',
        category: categoryId,
        difficulty: 'easy',
        usageCount: 10,
        correctRate: 0.8
      },
      {
        title: '题目2',
        content: '内容2',
        answer: '答案2',
        analysis: '解析2',
        category: categoryId,
        difficulty: 'medium',
        usageCount: 5,
        correctRate: 0.6
      }
    ]);
  });

  describe('题目使用统计', () => {
    it('应该能够获取题目使用统计', async () => {
      const response = await request(app)
        .get('/api/statistics/questions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCount', 2);
      expect(response.body.data).toHaveProperty('averageUsageCount', 7.5);
      expect(response.body.data).toHaveProperty('averageCorrectRate', 0.7);
    });

    it('应该能够按分类统计题目', async () => {
      const response = await request(app)
        .get('/api/statistics/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ category: categoryId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCount', 2);
      expect(response.body.data).toHaveProperty('categoryName', '数学');
    });

    it('应该能够按难度统计题目', async () => {
      const response = await request(app)
        .get('/api/statistics/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ difficulty: 'easy' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCount', 1);
      expect(response.body.data).toHaveProperty('averageCorrectRate', 0.8);
    });
  });

  describe('用户行为分析', () => {
    it('应该能够获取用户活跃度统计', async () => {
      const response = await request(app)
        .get('/api/statistics/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalUsers', 1);
      expect(response.body.data).toHaveProperty('activeUsers');
      expect(response.body.data).toHaveProperty('userGrowth');
    });

    it('应该能够获取用户答题统计', async () => {
      const response = await request(app)
        .get('/api/statistics/users/answers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalAnswers');
      expect(response.body.data).toHaveProperty('averageCorrectRate');
      expect(response.body.data).toHaveProperty('answerDistribution');
    });
  });

  describe('系统使用报告', () => {
    it('应该能够获取系统使用报告', async () => {
      const response = await request(app)
        .get('/api/statistics/system')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalQuestions');
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('totalAnswers');
      expect(response.body.data).toHaveProperty('systemLoad');
    });

    it('应该能够获取时间段内的使用报告', async () => {
      const response = await request(app)
        .get('/api/statistics/system')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('period');
      expect(response.body.data).toHaveProperty('usageTrend');
    });
  });
}); 