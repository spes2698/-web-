import { Request, Response } from 'express';
import { Question } from '../models/question';
import { Category } from '../models/category';
import { Tag } from '../models/tag';
import { AppError } from '../utils/error';

// 创建题目
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { title, content, answer, analysis, category, difficulty, tags } = req.body;

    // 验证分类是否存在
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new AppError('分类不存在', 404);
    }

    // 验证标签是否存在
    if (tags && tags.length > 0) {
      const tagExists = await Tag.find({ _id: { $in: tags } });
      if (tagExists.length !== tags.length) {
        throw new AppError('部分标签不存在', 404);
      }
    }

    const question = await Question.create({
      title,
      content,
      answer,
      analysis,
      category,
      difficulty,
      tags
    });

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '创建题目失败'
      });
    }
  }
};

// 获取题目列表
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { category, difficulty, tags, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };

    const questions = await Question.find(query)
      .populate('category', 'name')
      .populate('tags', 'name')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      data: questions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取题目列表失败'
    });
  }
};

// 获取单个题目
export const getQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('category', 'name')
      .populate('tags', 'name');

    if (!question) {
      throw new AppError('题目不存在', 404);
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取题目失败'
      });
    }
  }
};

// 更新题目
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { title, content, answer, analysis, category, difficulty, tags } = req.body;

    // 验证分类是否存在
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        throw new AppError('分类不存在', 404);
      }
    }

    // 验证标签是否存在
    if (tags && tags.length > 0) {
      const tagExists = await Tag.find({ _id: { $in: tags } });
      if (tagExists.length !== tags.length) {
        throw new AppError('部分标签不存在', 404);
      }
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        answer,
        analysis,
        category,
        difficulty,
        tags
      },
      { new: true, runValidators: true }
    ).populate('category', 'name')
     .populate('tags', 'name');

    if (!question) {
      throw new AppError('题目不存在', 404);
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '更新题目失败'
      });
    }
  }
};

// 删除题目
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      throw new AppError('题目不存在', 404);
    }

    res.json({
      success: true,
      message: '题目删除成功'
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '删除题目失败'
      });
    }
  }
}; 