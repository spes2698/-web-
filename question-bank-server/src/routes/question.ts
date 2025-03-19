import express from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/question';
import { auth } from '../middleware/auth';

const router = express.Router();

// 所有路由都需要认证
router.use(auth);

// 题目相关路由
router.post('/', createQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router; 