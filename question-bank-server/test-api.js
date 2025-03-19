const axios = require('axios');

const baseURL = 'http://localhost:3001/api';

async function testAPIs() {
  try {
    // 测试发送验证码
    console.log('测试发送验证码...');
    const sendCodeRes = await axios.post(`${baseURL}/auth/send-code`, {
      phone: '13800138000'
    });
    console.log('发送验证码结果:', sendCodeRes.data);

    // 测试登录
    console.log('\n测试登录...');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      phone: '13800138000',
      code: '123456' // 使用模拟验证码
    });
    console.log('登录结果:', loginRes.data);

    // 获取token
    const token = loginRes.data.token;

    // 测试第三方登录
    console.log('\n测试第三方登录...');
    const thirdPartyRes = await axios.post(`${baseURL}/auth/third-party`, {
      platform: 'wechat',
      code: 'test-code'
    });
    console.log('第三方登录结果:', thirdPartyRes.data);

    // 测试绑定第三方账号
    console.log('\n测试绑定第三方账号...');
    const bindRes = await axios.post(
      `${baseURL}/auth/bind-third-party`,
      {
        platform: 'wechat',
        code: 'test-code'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('绑定第三方账号结果:', bindRes.data);

    // 测试解绑第三方账号
    console.log('\n测试解绑第三方账号...');
    const unbindRes = await axios.post(
      `${baseURL}/auth/unbind-third-party/wechat`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('解绑第三方账号结果:', unbindRes.data);

  } catch (error) {
    if (error.response) {
      // 服务器响应了，但状态码不在 2xx 范围内
      console.error('测试出错:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('测试出错: 没有收到响应', error.request);
    } else {
      // 发送请求时出了点问题
      console.error('测试出错:', error.message);
    }
  }
}

testAPIs(); 