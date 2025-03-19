import axios from 'axios';
import { config } from '../config';

interface SendSmsParams {
  phone: string;
  code: string;
}

export class SmsService {
  private static instance: SmsService;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly signName: string;
  private readonly templateCode: string;

  private constructor() {
    this.accessKey = config.sms.accessKey;
    this.secretKey = config.sms.secretKey;
    this.signName = config.sms.signName;
    this.templateCode = config.sms.templateCode;
  }

  public static getInstance(): SmsService {
    if (!SmsService.instance) {
      SmsService.instance = new SmsService();
    }
    return SmsService.instance;
  }

  public async sendVerificationCode({ phone, code }: SendSmsParams): Promise<boolean> {
    try {
      // TODO: 实现实际的短信发送逻辑
      // 这里使用模拟发送
      console.log(`向${phone}发送验证码：${code}`);
      return true;
    } catch (error) {
      console.error('发送验证码失败：', error);
      return false;
    }
  }
} 