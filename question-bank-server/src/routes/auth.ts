import { Router } from 'express';
import { body } from 'express-validator';
import {
  sendCode,
  login,
  thirdPartyLogin,
  bindThirdParty,
  unbindThirdParty,
} from '../controllers/auth';
import { auth } from '../middlewares/auth';

const router = Router();

// 发送验证码
router.post(
  '/send-code',
  [body('phone').isMobilePhone('zh-CN')],
  sendCode
);

// 手机号验证码登录
router.post(
  '/login',
  [
    body('phone').isMobilePhone('zh-CN'),
    body('code').isLength({ min: 6, max: 6 }),
  ],
  login
);

// 第三方登录
router.post(
  '/third-party',
  [
    body('platform').isIn(['wechat', 'qq']),
    body('code').notEmpty(),
  ],
  thirdPartyLogin
);

// 绑定第三方账号
router.post(
  '/bind-third-party',
  auth,
  [
    body('platform').isIn(['wechat', 'qq']),
    body('code').notEmpty(),
  ],
  bindThirdParty
);

// 解绑第三方账号
router.post(
  '/unbind-third-party/:platform',
  auth,
  unbindThirdParty
);

export default router; 