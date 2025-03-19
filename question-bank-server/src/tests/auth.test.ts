import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index';
import { User } from '../models/user';
import { ThirdPartyAccount } from '../models/third-party-account';
import { config } from '../config';

describe('认证接口测试', () => {
  beforeAll(async () => {
    // 连接测试数据库
    await mongoose.connect(config.mongodb.uri);
  });

  afterAll(async () => {
    // 清理测试数据并断开连接
    await User.deleteMany({});
    await ThirdPartyAccount.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // 每个测试前清理数据
    await User.deleteMany({});
    await ThirdPartyAccount.deleteMany({});
  });

  describe('发送验证码', () => {
    it('应该成功发送验证码', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({ phone: '13800138000' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('验证码已发送');
    });

    it('应该验证手机号格式', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({ phone: '123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('无效的手机号格式');
    });

    it('应该限制发送频率', async () => {
      await request(app)
        .post('/api/auth/send-code')
        .send({ phone: '13800138000' });

      const response = await request(app)
        .post('/api/auth/send-code')
        .send({ phone: '13800138000' });

      expect(response.status).toBe(429);
      expect(response.body.success).toBe(false);
    });
  });

  describe('手机号登录', () => {
    it('应该成功登录', async () => {
      // 先发送验证码
      await request(app)
        .post('/api/auth/send-code')
        .send({ phone: '13800138000' });

      // 使用验证码登录
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '13800138000',
          code: '123456' // 测试环境固定验证码
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.phone).toBe('13800138000');
    });

    it('应该验证验证码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '13800138000',
          code: 'wrong_code'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('验证码错误');
    });

    it('应该验证手机号是否已发送验证码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ phone: '13800138000', code: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('第三方登录', () => {
    it('应该成功处理微信登录', async () => {
      const response = await request(app)
        .post('/api/auth/third-party')
        .send({
          platform: 'wechat',
          code: 'test_code',
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.thirdPartyAccounts).toBeDefined();
      expect(response.body.user.thirdPartyAccounts[0].platform).toBe('wechat');
    });

    it('应该成功处理QQ登录', async () => {
      const response = await request(app)
        .post('/api/auth/third-party')
        .send({
          platform: 'qq',
          code: 'test_code',
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.thirdPartyAccounts).toBeDefined();
      expect(response.body.user.thirdPartyAccounts[0].platform).toBe('qq');
    });

    it('应该验证平台类型', async () => {
      const response = await request(app)
        .post('/api/auth/third-party')
        .send({
          platform: 'invalid_platform',
          code: 'test_code'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('不支持的平台类型');
    });

    it('应该验证授权码', async () => {
      const response = await request(app)
        .post('/api/auth/third-party')
        .send({
          platform: 'wechat',
          code: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('授权码不能为空');
    });
  });

  describe('绑定第三方账号', () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
      // 创建测试用户
      const phone = '13800138000';
      await request(app)
        .post('/api/auth/send-code')
        .send({ phone });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ phone, code: '123456' });

      token = loginResponse.body.token;
      userId = loginResponse.body.user._id;
    });

    it('应该成功绑定微信账号', async () => {
      const response = await request(app)
        .post('/api/auth/bind')
        .set('Authorization', `Bearer ${token}`)
        .send({
          platform: 'wechat',
          code: 'test_code',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const user = await User.findById(userId).populate('thirdPartyAccounts');
      expect(user?.thirdPartyAccounts).toBeDefined();
      expect(user?.thirdPartyAccounts?.length).toBe(1);
      expect(user?.thirdPartyAccounts?.[0].platform).toBe('wechat');
    });

    it('应该验证是否已登录', async () => {
      const response = await request(app)
        .post('/api/auth/bind')
        .send({
          platform: 'wechat',
          code: 'test_code',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('不应该重复绑定同一平台', async () => {
      await request(app)
        .post('/api/auth/bind')
        .set('Authorization', `Bearer ${token}`)
        .send({
          platform: 'wechat',
          code: 'test_code',
        });

      const response = await request(app)
        .post('/api/auth/bind')
        .set('Authorization', `Bearer ${token}`)
        .send({
          platform: 'wechat',
          code: 'test_code',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
}); 