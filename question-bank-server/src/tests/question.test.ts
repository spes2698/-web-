import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index';
import { Question } from '../models/question';
import { Category } from '../models/category';
import { Tag } from '../models/tag';
import { config } from '../config';

describe('题库管理接口测试', () => {
  let authToken: string;

  beforeAll(async () => {
    await mongoose.connect(config.mongodb.uri);
    // TODO: 获取测试用的认证token
  });

  afterAll(async () => {
    await Question.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Question.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
  });

  describe('题目分类管理', () => {
    it('应该创建题目分类', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '数学',
          description: '数学相关题目'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('数学');
    });

    it('应该获取题目分类列表', async () => {
      // 先创建分类
      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '数学',
          description: '数学相关题目'
        });

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('题目标签管理', () => {
    it('应该创建题目标签', async () => {
      const response = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '基础题',
          color: '#ff0000'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('基础题');
    });

    it('应该获取标签列表', async () => {
      // 先创建标签
      await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '基础题',
          color: '#ff0000'
        });

      const response = await request(app)
        .get('/api/tags')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('题目管理', () => {
    let categoryId: string;
    let tagId: string;

    beforeEach(async () => {
      // 创建测试用的分类和标签
      const categoryResponse = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '数学',
          description: '数学相关题目'
        });
      categoryId = categoryResponse.body.data._id;

      const tagResponse = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '基础题',
          color: '#ff0000'
        });
      tagId = tagResponse.body.data._id;
    });

    it('应该创建题目', async () => {
      const response = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '1+1等于多少？',
          content: '请计算1+1的结果',
          answer: '2',
          analysis: '这是最基础的加法运算',
          category: categoryId,
          difficulty: 'easy',
          tags: [tagId]
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('1+1等于多少？');
    });

    it('应该获取题目列表', async () => {
      // 先创建题目
      await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '1+1等于多少？',
          content: '请计算1+1的结果',
          answer: '2',
          analysis: '这是最基础的加法运算',
          category: categoryId,
          difficulty: 'easy',
          tags: [tagId]
        });

      const response = await request(app)
        .get('/api/questions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('应该更新题目', async () => {
      // 先创建题目
      const createResponse = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '1+1等于多少？',
          content: '请计算1+1的结果',
          answer: '2',
          analysis: '这是最基础的加法运算',
          category: categoryId,
          difficulty: 'easy',
          tags: [tagId]
        });

      const questionId = createResponse.body.data._id;

      const response = await request(app)
        .put(`/api/questions/${questionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '2+2等于多少？',
          content: '请计算2+2的结果',
          answer: '4',
          analysis: '这是基础的加法运算',
          difficulty: 'medium'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('2+2等于多少？');
      expect(response.body.data.difficulty).toBe('medium');
    });

    it('应该删除题目', async () => {
      // 先创建题目
      const createResponse = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '1+1等于多少？',
          content: '请计算1+1的结果',
          answer: '2',
          analysis: '这是最基础的加法运算',
          category: categoryId,
          difficulty: 'easy',
          tags: [tagId]
        });

      const questionId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/questions/${questionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // 验证题目已被删除
      const getResponse = await request(app)
        .get(`/api/questions/${questionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
}); 