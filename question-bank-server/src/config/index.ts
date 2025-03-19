import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3002,
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/question-bank'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  sms: {
    accessKey: process.env.SMS_ACCESS_KEY_ID || '',
    secretKey: process.env.SMS_ACCESS_KEY_SECRET || '',
    signName: process.env.SMS_SIGN_NAME || '',
    templateCode: process.env.SMS_TEMPLATE_CODE || ''
  },
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    appSecret: process.env.WECHAT_APP_SECRET || '',
    redirectUri: process.env.WECHAT_REDIRECT_URI || ''
  },
  qq: {
    appId: process.env.QQ_APP_ID || '',
    appKey: process.env.QQ_APP_KEY || '',
    redirectUri: process.env.QQ_REDIRECT_URI || ''
  }
}; 