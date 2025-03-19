import { useState } from 'react';
import { Form, Input, Button, Card, Divider, message } from 'antd';
import { MobileOutlined, LockOutlined, WechatOutlined, QqOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    try {
      const phone = form.getFieldValue('phone');
      if (!phone) {
        message.error('请输入手机号');
        return;
      }
      // TODO: 调用发送验证码API
      message.success('验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      message.error('发送验证码失败');
    }
  };

  const handleLogin = async (values: any) => {
    try {
      // TODO: 调用登录API
      console.log('登录信息：', values);
      message.success('登录成功');
      navigate('/admin');
    } catch (error) {
      message.error('登录失败');
    }
  };

  const handleThirdPartyLogin = (type: 'wechat' | 'qq') => {
    // TODO: 实现第三方登录
    message.info(`${type === 'wechat' ? '微信' : 'QQ'}登录功能开发中`);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2 className="login-title">题库管理系统</h2>
        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input 
              prefix={<MobileOutlined />} 
              placeholder="请输入手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="code"
            label="验证码"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div className="code-input-group">
              <Input 
                prefix={<LockOutlined />} 
                placeholder="请输入验证码"
                size="large"
              />
              <Button 
                type="primary" 
                onClick={handleSendCode}
                disabled={countdown > 0}
                size="large"
              >
                {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>

          <Divider>其他登录方式</Divider>

          <div className="third-party-login">
            <Button 
              icon={<WechatOutlined />} 
              onClick={() => handleThirdPartyLogin('wechat')}
              className="wechat-btn"
            >
              微信登录
            </Button>
            <Button 
              icon={<QqOutlined />} 
              onClick={() => handleThirdPartyLogin('qq')}
              className="qq-btn"
            >
              QQ登录
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 