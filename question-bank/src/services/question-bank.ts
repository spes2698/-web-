import axios from 'axios';
import type {
  QuestionBank,
  QuestionBankListResponse,
  QuestionBankResponse,
  ImportQuestionsRequest,
  ImportQuestionsResponse,
  ExportQuestionsResponse,
  ImportProgressResponse
} from '../types/question-bank';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const questionBankApi = {
  // 获取题库列表
  getList: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const response = await axios.get<QuestionBankListResponse>(`${API_BASE_URL}/question-banks`, { params });
    return response.data;
  },

  // 获取题库详情
  getById: async (id: string) => {
    const response = await axios.get<QuestionBankResponse>(`${API_BASE_URL}/question-banks/${id}`);
    return response.data;
  },

  // 创建题库
  create: async (data: Partial<QuestionBank>) => {
    const response = await axios.post<QuestionBankResponse>(`${API_BASE_URL}/question-banks`, data);
    return response.data;
  },

  // 更新题库
  update: async (id: string, data: Partial<QuestionBank>) => {
    const response = await axios.put<QuestionBankResponse>(`${API_BASE_URL}/question-banks/${id}`, data);
    return response.data;
  },

  // 删除题库
  delete: async (id: string) => {
    const response = await axios.delete<{ success: boolean }>(`${API_BASE_URL}/question-banks/${id}`);
    return response.data;
  },

  // 导入题目
  importQuestions: async (data: ImportQuestionsRequest) => {
    const formData = new FormData();
    formData.append('file', data.file);
    const response = await axios.post<ImportQuestionsResponse>(
      `${API_BASE_URL}/question-banks/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // 导出题目
  exportQuestions: async (id: string) => {
    const response = await axios.get<ExportQuestionsResponse>(
      `${API_BASE_URL}/question-banks/${id}/export`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  // 获取题库统计信息
  getStatistics: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/question-banks/${id}/statistics`);
    return response.data;
  },

  // 更新题库设置
  updateSettings: async (id: string, settings: QuestionBank['settings']) => {
    const response = await axios.put(`${API_BASE_URL}/question-banks/${id}/settings`, settings);
    return response.data;
  },

  // 分享题库
  share: async (id: string, data: { users: string[]; groups: string[] }) => {
    const response = await axios.post(`${API_BASE_URL}/question-banks/${id}/share`, data);
    return response.data;
  },

  // 取消分享
  unshare: async (id: string, data: { users: string[]; groups: string[] }) => {
    const response = await axios.post(`${API_BASE_URL}/question-banks/${id}/unshare`, data);
    return response.data;
  },

  // 获取Excel模板
  getTemplate: async () => {
    const response = await axios.get<ExportQuestionsResponse>(
      `${API_BASE_URL}/question-banks/template`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  // 导入题目（带进度）
  importQuestionsWithProgress: async (data: ImportQuestionsRequest, onProgress: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', data.file);
    
    const response = await axios.post<ImportQuestionsResponse>(
      `${API_BASE_URL}/question-banks/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          onProgress(progress);
        },
      }
    );
    return response.data;
  },

  // 获取导入进度
  getImportProgress: async (taskId: string) => {
    const response = await axios.get<ImportProgressResponse>(
      `${API_BASE_URL}/question-banks/import/progress/${taskId}`
    );
    return response.data;
  },

  // 验证导入数据
  validateImportData: async (data: ImportQuestionsRequest) => {
    const formData = new FormData();
    formData.append('file', data.file);
    
    const response = await axios.post<ImportQuestionsResponse>(
      `${API_BASE_URL}/question-banks/import/validate`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
};

export default questionBankApi; 