import { Request, Response } from 'express';
import { Category } from '../models/category';
import { AppError } from '../utils/error';

// 创建分类
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parent } = req.body;

    // 验证父分类是否存在
    if (parent) {
      const parentExists = await Category.findById(parent);
      if (!parentExists) {
        throw new AppError('父分类不存在', 404);
      }
    }

    const category = await Category.create({
      name,
      description,
      parent
    });

    res.status(201).json({
      success: true,
      data: category
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
        message: '创建分类失败'
      });
    }
  }
};

// 获取分类列表
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find()
      .populate('parent', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取分类列表失败'
    });
  }
};

// 获取单个分类
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name');

    if (!category) {
      throw new AppError('分类不存在', 404);
    }

    res.json({
      success: true,
      data: category
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
        message: '获取分类失败'
      });
    }
  }
};

// 更新分类
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parent } = req.body;

    // 验证父分类是否存在
    if (parent) {
      const parentExists = await Category.findById(parent);
      if (!parentExists) {
        throw new AppError('父分类不存在', 404);
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        parent
      },
      { new: true, runValidators: true }
    ).populate('parent', 'name');

    if (!category) {
      throw new AppError('分类不存在', 404);
    }

    res.json({
      success: true,
      data: category
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
        message: '更新分类失败'
      });
    }
  }
};

// 删除分类
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      throw new AppError('分类不存在', 404);
    }

    res.json({
      success: true,
      message: '分类删除成功'
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
        message: '删除分类失败'
      });
    }
  }
}; 