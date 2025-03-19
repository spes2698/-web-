import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User, IUser } from '../models/user';
import { ThirdPartyAccount } from '../models/third-party-account';
import { config } from '../config';
import { AppError } from '../middlewares/error';
import { ThirdPartyService } from '../services/third-party';

interface RequestWithUser extends Request {
  user?: {
    _id: Types.ObjectId | string;
  };
}

interface ThirdPartyLoginResult {
  user: {
    id: string;
  };
}

const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    config.jwt.secret,
    {
      expiresIn: '7d' // 使用字符串格式的过期时间
    }
  );
};

export const sendCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      res.status(400).json({
        success: false,
        message: '无效的手机号格式'
      });
      return;
    }

    // 生成验证码
    const code = Math.random().toString().slice(2, 8);
    // TODO: 发送验证码到手机
    console.log(`向${phone}发送验证码：${code}`);
    console.log('验证码：', code);

    res.json({
      success: true,
      message: '验证码已发送'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '发送验证码失败'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, code } = req.body;

    // TODO: 验证验证码
    if (code !== '123456') {
      res.status(400).json({
        success: false,
        message: '验证码错误'
      });
      return;
    }

    // 查找或创建用户
    let user = await User.findOne({ phone }).lean() as IUser | null;
    if (!user) {
      const newUser = await User.create({ phone });
      user = newUser.toObject() as IUser;
    }

    if (!user._id) {
      throw new Error('用户ID不存在');
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
};

export const thirdPartyLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { platform, code } = req.body;

    if (!['wechat', 'qq'].includes(platform)) {
      res.status(400).json({
        success: false,
        message: '不支持的平台类型'
      });
      return;
    }

    if (!code) {
      res.status(400).json({
        success: false,
        message: '授权码不能为空'
      });
      return;
    }

    const thirdPartyService = ThirdPartyService.getInstance();
    const result = await thirdPartyService.handleThirdPartyLogin(platform as 'wechat' | 'qq', code) as ThirdPartyLoginResult;

    const token = generateToken(result.user.id);

    res.json({
      success: true,
      token,
      user: result.user
    });
  } catch (error) {
    console.error('第三方登录失败：', error);
    res.status(500).json({
      success: false,
      message: '第三方登录失败'
    });
  }
};

export const bindThirdParty = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { platform, code } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '请先登录'
      });
      return;
    }

    const thirdPartyService = ThirdPartyService.getInstance();
    await thirdPartyService.bindThirdPartyAccount(
      typeof userId === 'string' ? userId : userId.toString(),
      platform as 'wechat' | 'qq',
      code
    );

    res.json({
      success: true,
      message: '绑定成功'
    });
  } catch (error) {
    console.error('绑定第三方账号失败：', error);
    res.status(500).json({
      success: false,
      message: '绑定失败'
    });
  }
};

export const unbindThirdParty = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { platform } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '请先登录'
      });
      return;
    }

    await ThirdPartyAccount.findOneAndDelete({
      userId: typeof userId === 'string' ? userId : userId.toString(),
      platform
    });

    res.json({
      success: true,
      message: '解绑成功'
    });
  } catch (error) {
    console.error('解绑第三方账号失败：', error);
    res.status(500).json({
      success: false,
      message: '解绑失败'
    });
  }
}; 