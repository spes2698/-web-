import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { User } from '../models/user';
import { generateToken } from '../utils/auth';

describe('用户管理接口测试', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // 创建测试用户
    const user = await User.create({
      phone: '13800138000',
      nickname: '测试用户',
      role: 'user'
    });
    userId = user._id.toString();
    authToken = generateToken(user._id);
  });

  describe('用户信息更新', () => {
    it('应该成功更新用户信息', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nickname: '新昵称',
          avatar: 'http://example.com/avatar.jpg'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nickname).toBe('新昵称');
    });

    it('未授权用户不能更新信息', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          nickname: '新昵称'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('用户角色管理', () => {
    it('管理员应该能够更新用户角色', async () => {
      // 创建管理员用户
      const admin = await User.create({
        phone: '13800138001',
        role: 'admin'
      });
      const adminToken = generateToken(admin._id);

      const response = await request(app)
        .put(`/api/users/${userId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: 'teacher'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('teacher');
    });

    it('普通用户不能更新角色', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}/role`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          role: 'teacher'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('用户列表查询', () => {
    it('管理员应该能够获取用户列表', async () => {
      // 创建管理员用户
      const admin = await User.create({
        phone: '13800138001',
        role: 'admin'
      });
      const adminToken = generateToken(admin._id);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('普通用户不能获取用户列表', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });
  });
}); 