import axios from 'axios';
import type { 
  LoginRequest, 
  LoginResponse, 
  SendCodeRequest, 
  ThirdPartyLoginRequest,
  UserProfile,
  UserStatistics
} from '../types/user';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const userApi = {
  // 发送验证码
  sendCode: async (data: SendCodeRequest) => {
    const response = await axios.post(`${API_BASE_URL}/auth/send-code`, data);
    return response.data;
  },

  // 手机号验证码登录
  login: async (data: LoginRequest) => {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  },

  // 第三方登录
  thirdPartyLogin: async (data: ThirdPartyLoginRequest) => {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/third-party`, data);
    return response.data;
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/current`);
    return response.data;
  },

  // 绑定第三方账号
  bindThirdParty: async (data: ThirdPartyLoginRequest) => {
    const response = await axios.post(`${API_BASE_URL}/user/bind-third-party`, data);
    return response.data;
  },

  // 解绑第三方账号
  unbindThirdParty: async (platform: 'wechat' | 'qq') => {
    const response = await axios.post(`${API_BASE_URL}/user/unbind-third-party`, { platform });
    return response.data;
  },

  // 更新用户信息
  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await axios.put(`${API_BASE_URL}/user/profile`, data);
    return response.data;
  },

  // 获取用户统计数据
  getStatistics: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/statistics`);
    return response.data;
  },

  // 更新用户偏好设置
  updatePreferences: async (data: Partial<UserProfile['preferences']>) => {
    const response = await axios.put(`${API_BASE_URL}/user/preferences`, data);
    return response.data;
  },

  // 获取用户学习历史
  getLearningHistory: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await axios.get(`${API_BASE_URL}/user/history`, { params });
    return response.data;
  },

  // 获取用户错题本
  getWrongQuestions: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/wrong-questions`);
    return response.data;
  },

  // 获取用户收藏题目
  getFavoriteQuestions: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/favorite-questions`);
    return response.data;
  }
};

export default userApi; 