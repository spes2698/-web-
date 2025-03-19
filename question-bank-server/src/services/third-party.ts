import axios from 'axios';
import { config } from '../config';
import { User } from '../models/user';
import { ThirdPartyAccount } from '../models/third-party-account';
import jwt from 'jsonwebtoken';

interface ThirdPartyUserInfo {
  openId: string;
  nickname?: string;
  avatar?: string;
}

export class ThirdPartyService {
  private static instance: ThirdPartyService;

  private constructor() {}

  public static getInstance(): ThirdPartyService {
    if (!ThirdPartyService.instance) {
      ThirdPartyService.instance = new ThirdPartyService();
    }
    return ThirdPartyService.instance;
  }

  // 获取微信用户信息
  private async getWechatUserInfo(code: string): Promise<ThirdPartyUserInfo> {
    try {
      // 1. 获取access_token
      const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wechat.appId}&secret=${config.wechat.appSecret}&code=${code}&grant_type=authorization_code`;
      const tokenRes = await axios.get(tokenUrl);
      const { access_token, openid } = tokenRes.data;

      // 2. 获取用户信息
      const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
      const userInfoRes = await axios.get(userInfoUrl);
      const { nickname, headimgurl } = userInfoRes.data;

      return {
        openId: openid,
        nickname,
        avatar: headimgurl,
      };
    } catch (error) {
      console.error('获取微信用户信息失败：', error);
      throw new Error('获取微信用户信息失败');
    }
  }

  // 获取QQ用户信息
  private async getQQUserInfo(code: string): Promise<ThirdPartyUserInfo> {
    try {
      // 1. 获取access_token
      const tokenUrl = `https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.qq.appId}&client_secret=${config.qq.appSecret}&code=${code}&redirect_uri=${encodeURIComponent(config.qq.redirectUri)}`;
      const tokenRes = await axios.get(tokenUrl);
      const access_token = tokenRes.data.split('&')[0].split('=')[1];

      // 2. 获取openid
      const openidUrl = `https://graph.qq.com/oauth2.0/me?access_token=${access_token}`;
      const openidRes = await axios.get(openidUrl);
      const openid = JSON.parse(openidRes.data.replace('callback(', '').replace(');', '')).openid;

      // 3. 获取用户信息
      const userInfoUrl = `https://graph.qq.com/user/get_user_info?access_token=${access_token}&oauth_consumer_key=${config.qq.appId}&openid=${openid}`;
      const userInfoRes = await axios.get(userInfoUrl);
      const { nickname, figureurl_qq_2 } = userInfoRes.data;

      return {
        openId: openid,
        nickname,
        avatar: figureurl_qq_2,
      };
    } catch (error) {
      console.error('获取QQ用户信息失败：', error);
      throw new Error('获取QQ用户信息失败');
    }
  }

  // 生成JWT token
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  // 处理第三方登录
  public async handleThirdPartyLogin(platform: 'wechat' | 'qq', code: string) {
    try {
      // 1. 获取第三方用户信息
      let userInfo: ThirdPartyUserInfo;
      if (platform === 'wechat') {
        userInfo = await this.getWechatUserInfo(code);
      } else {
        userInfo = await this.getQQUserInfo(code);
      }

      // 2. 查找第三方账号
      let thirdPartyAccount = await ThirdPartyAccount.findOne({
        platform,
        openId: userInfo.openId,
      });

      let user;
      if (!thirdPartyAccount) {
        // 3. 创建新用户
        user = await User.create({
          nickname: userInfo.nickname || `用户${Math.random().toString(36).slice(-6)}`,
          avatar: userInfo.avatar,
          role: 'user'
        });

        // 4. 创建第三方账号记录
        thirdPartyAccount = await ThirdPartyAccount.create({
          userId: user._id,
          platform,
          openId: userInfo.openId,
          nickname: userInfo.nickname,
          avatar: userInfo.avatar,
        });
      } else {
        user = await User.findById(thirdPartyAccount.userId);
        if (!user) {
          throw new Error('用户不存在');
        }
      }

      // 5. 生成token
      const token = this.generateToken(user._id);

      return {
        token,
        user: {
          id: user._id,
          nickname: user.nickname,
          avatar: user.avatar,
          role: user.role,
          phone: user.phone,
          needBindPhone: !user.phone
        },
      };
    } catch (error) {
      console.error('第三方登录失败：', error);
      throw error;
    }
  }

  // 绑定第三方账号
  public async bindThirdPartyAccount(userId: string, platform: 'wechat' | 'qq', code: string) {
    try {
      // 1. 获取第三方用户信息
      let userInfo: ThirdPartyUserInfo;
      if (platform === 'wechat') {
        userInfo = await this.getWechatUserInfo(code);
      } else {
        userInfo = await this.getQQUserInfo(code);
      }

      // 2. 检查是否已绑定
      const existingAccount = await ThirdPartyAccount.findOne({
        platform,
        openId: userInfo.openId,
      });

      if (existingAccount) {
        throw new Error('该第三方账号已被其他用户绑定');
      }

      // 3. 创建绑定记录
      await ThirdPartyAccount.create({
        userId,
        platform,
        openId: userInfo.openId,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
      });

      return { message: '绑定成功' };
    } catch (error) {
      console.error('绑定第三方账号失败：', error);
      throw error;
    }
  }

  // 解绑第三方账号
  public async unbindThirdPartyAccount(userId: string, platform: 'wechat' | 'qq') {
    try {
      await ThirdPartyAccount.findOneAndDelete({ userId, platform });
      return { message: '解绑成功' };
    } catch (error) {
      console.error('解绑第三方账号失败：', error);
      throw error;
    }
  }
} 