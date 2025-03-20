import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, EnvironmentOutlined, BookOutlined, SettingOutlined } from '@ant-design/icons';
import type { User } from '../types/user';
import userApi from '../services/user';

const { Option } = Select;

interface UserProfile {
  phone: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  profile: {
    realName?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: Date;
    location?: string;
    bio?: string;
    education?: string;
    organization?: string;
  };
  stats: {
    answerCount: number;
    correctCount: number;
    totalTime: number;
    lastPracticeAt?: Date;
    favoriteQuestions: string[];
    wrongQuestions: string[];
  };
  preferences: {
    questionTypes: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    dailyGoal: number;
    emailNotification: boolean;
    pushNotification: boolean;
  };
}

const UserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getCurrentUser();
      if (response.success) {
        setUserProfile(response.data);
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await userApi.updateProfile(values);
      if (response.success) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        {/* 个人信息卡片 */}
        <Col span={8}>
          <Card
            title={<span><UserOutlined /> 个人信息</span>}
            className="h-full"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="nickname"
                label="昵称"
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                name="email"
                label="邮箱"
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              <Form.Item
                name={['profile', 'realName']}
                label="真实姓名"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['profile', 'gender']}
                label="性别"
              >
                <Select>
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['profile', 'birthday']}
                label="生日"
              >
                <DatePicker />
              </Form.Item>
              <Form.Item
                name={['profile', 'location']}
                label="所在地"
              >
                <Input prefix={<EnvironmentOutlined />} />
              </Form.Item>
              <Form.Item
                name={['profile', 'education']}
                label="学历"
              >
                <Input prefix={<BookOutlined />} />
              </Form.Item>
              <Form.Item
                name={['profile', 'organization']}
                label="组织"
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 学习统计卡片 */}
        <Col span={16}>
          <Card
            title={<span><BookOutlined /> 学习统计</span>}
            className="h-full"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic
                  title="总答题数"
                  value={userProfile?.stats.answerCount || 0}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="正确题数"
                  value={userProfile?.stats.correctCount || 0}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="正确率"
                  value={userProfile?.stats.answerCount ? 
                    (userProfile.stats.correctCount / userProfile.stats.answerCount * 100).toFixed(1) : 0}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
            <div className="mt-4">
              <h3>每日目标进度</h3>
              <Progress
                percent={Math.min(
                  (userProfile?.stats.answerCount || 0) / (userProfile?.preferences.dailyGoal || 1) * 100,
                  100
                )}
              />
            </div>
          </Card>
        </Col>

        {/* 偏好设置卡片 */}
        <Col span={24}>
          <Card
            title={<span><SettingOutlined /> 偏好设置</span>}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name={['preferences', 'questionTypes']}
                label="题目类型"
              >
                <Select mode="multiple">
                  <Option value="single">单选题</Option>
                  <Option value="multiple">多选题</Option>
                  <Option value="judge">判断题</Option>
                  <Option value="essay">问答题</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['preferences', 'difficulty']}
                label="难度偏好"
              >
                <Select>
                  <Option value="easy">简单</Option>
                  <Option value="medium">中等</Option>
                  <Option value="hard">困难</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['preferences', 'dailyGoal']}
                label="每日目标题数"
              >
                <Input type="number" min={1} />
              </Form.Item>
              <Form.Item
                name={['preferences', 'emailNotification']}
                label="邮件通知"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>开启</Option>
                  <Option value={false}>关闭</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['preferences', 'pushNotification']}
                label="推送通知"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>开启</Option>
                  <Option value={false}>关闭</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile; 