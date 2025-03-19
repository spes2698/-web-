import axios from 'axios';
import type { 
  LoginRequest, 
  LoginResponse, 
  SendCodeRequest, 
  ThirdPartyLoginRequest 
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
};

export default userApi; 