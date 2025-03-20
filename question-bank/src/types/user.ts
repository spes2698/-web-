export interface User {
  id: string;
  phone: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'teacher' | 'student';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  phone: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  profile: {
    realName?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: Date;
    location?: string;
    bio?: string;
    education?: string;
    organization?: string;
  };
  stats: {
    answerCount: number;
    correctCount: number;
    totalTime: number;
    lastPracticeAt?: Date;
    favoriteQuestions: string[];
    wrongQuestions: string[];
  };
  preferences: {
    questionTypes: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    dailyGoal: number;
    emailNotification: boolean;
    pushNotification: boolean;
  };
}

export interface UserStatistics {
  daily: {
    date: string;
    practiceCount: number;
    questionCount: number;
    correctCount: number;
    totalTime: number;
    completedGoal: boolean;
  }[];
  weekly: {
    weekStart: string;
    practiceCount: number;
    questionCount: number;
    correctCount: number;
    totalTime: number;
    averageScore: number;
    streakDays: number;
  }[];
  monthly: {
    monthStart: string;
    practiceCount: number;
    questionCount: number;
    correctCount: number;
    totalTime: number;
    averageScore: number;
    improvement: number;
  }[];
  categories: {
    categoryId: string;
    questionCount: number;
    correctCount: number;
    averageScore: number;
    lastPracticed: string;
  }[];
  questionTypes: {
    type: string;
    count: number;
    correctCount: number;
    averageTime: number;
  }[];
  progress: {
    totalQuestions: number;
    completedQuestions: number;
    masteredQuestions: number;
    weakQuestions: number;
    averageAccuracy: number;
    estimatedLevel: string;
  };
  recommendations: {
    questionIds: string[];
    categoryIds: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    updatedAt: string;
  };
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
  success: boolean;
  data: {
    token: string;
    user: User;
  };
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