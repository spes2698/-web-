import { Request, Response, NextFunction } from 'express';
import { Question } from '../models/question';
import { User } from '../models/user';
import { Category } from '../models/category';
import { AppError } from '../utils/error';

// 题目使用统计
export const getQuestionStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, difficulty } = req.query;
    const query: any = {};

    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const questions = await Question.find(query);
    const totalCount = questions.length;
    const averageUsageCount = questions.reduce((acc, q) => acc + q.usageCount, 0) / totalCount;
    const averageCorrectRate = questions.reduce((acc, q) => acc + q.correctRate, 0) / totalCount;

    let categoryName = '';
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (categoryDoc) {
        categoryName = categoryDoc.name;
      }
    }

    res.json({
      success: true,
      data: {
        totalCount,
        averageUsageCount,
        averageCorrectRate,
        categoryName
      }
    });
  } catch (error) {
    next(error);
  }
};

// 用户行为分析
export const getUserStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // 计算用户增长率
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const userGrowth = (newUsers / totalUsers) * 100;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        userGrowth: userGrowth.toFixed(2) + '%'
      }
    });
  } catch (error) {
    next(error);
  }
};

// 用户答题统计
export const getUserAnswerStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    let totalAnswers = 0;
    let totalCorrect = 0;

    for (const user of users) {
      totalAnswers += user.answerCount || 0;
      totalCorrect += user.correctCount || 0;
    }

    const averageCorrectRate = totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0;

    // 答题分布统计
    const answerDistribution = await Question.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          averageCorrectRate: { $avg: '$correctRate' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalAnswers,
        averageCorrectRate: averageCorrectRate.toFixed(2) + '%',
        answerDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

// 系统使用报告
export const getSystemStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const totalQuestions = await Question.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAnswers = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$answerCount' } } }
    ]);

    // 系统负载统计
    const systemLoad = {
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };

    // 使用趋势统计
    const usageTrend = await Question.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalQuestions,
        totalUsers,
        totalAnswers: totalAnswers[0]?.total || 0,
        systemLoad,
        period: startDate && endDate ? { startDate, endDate } : undefined,
        usageTrend
      }
    });
  } catch (error) {
    next(error);
  }
}; 