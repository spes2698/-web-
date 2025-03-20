export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  cover?: string;
  category: string;
  tags: string[];
  questions: string[];
  visibility: 'private' | 'public' | 'shared';
  sharedWith: {
    users: string[];
    groups: string[];
  };
  stats: {
    questionCount: number;
    practiceCount: number;
    averageScore: number;
    lastUpdated: string;
  };
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number;
    recommendedLevel: string;
    prerequisites: string[];
  };
  settings: {
    shuffleQuestions: boolean;
    showAnswers: boolean;
    timeLimit?: number;
    passScore: number;
    allowReview: boolean;
    allowRetry: boolean;
  };
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionBankListResponse {
  success: boolean;
  data: {
    items: QuestionBank[];
    total: number;
  };
}

export interface QuestionBankResponse {
  success: boolean;
  data: QuestionBank;
}

export interface ImportQuestionsRequest {
  file: File;
}

export interface ImportQuestionsResponse {
  success: boolean;
  data: {
    importedCount: number;
    failedCount: number;
    errors?: string[];
  };
}

export interface ExportQuestionsResponse {
  success: boolean;
  data: Blob;
}

export interface ImportProgressResponse {
  success: boolean;
  data: {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    total: number;
    processed: number;
    errors?: string[];
    result?: {
      importedCount: number;
      failedCount: number;
      errors?: string[];
    };
  };
}

export interface ImportValidationResult {
  success: boolean;
  data: {
    isValid: boolean;
    errors: {
      row: number;
      field: string;
      message: string;
    }[];
    warnings: {
      row: number;
      field: string;
      message: string;
    }[];
    summary: {
      totalRows: number;
      validRows: number;
      invalidRows: number;
    };
  };
} 