export interface User {
  id: string;
  phone: string;
  nickname?: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface ThirdPartyAccount {
  id: string;
  userId: string;
  platform: 'wechat' | 'qq';
  openId: string;
  nickname?: string;
  avatar?: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SendCodeRequest {
  phone: string;
}

export interface LoginRequest {
  phone: string;
  code: string;
}

export interface ThirdPartyLoginRequest {
  platform: 'wechat' | 'qq';
  code: string;
} 