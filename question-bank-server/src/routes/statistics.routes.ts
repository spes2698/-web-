import express from 'express';
import {
  getQuestionStatistics,
  getUserStatistics,
  getUserAnswerStatistics,
  getSystemStatistics
} from '../controllers/statistics.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// 题目使用统计
router.get('/questions', authenticate, authorize(['admin']), getQuestionStatistics);

// 用户行为分析
router.get('/users', authenticate, authorize(['admin']), getUserStatistics);

// 用户答题统计
router.get('/users/answers', authenticate, authorize(['admin']), getUserAnswerStatistics);

// 系统使用报告
router.get('/system', authenticate, authorize(['admin']), getSystemStatistics);

export default router; 