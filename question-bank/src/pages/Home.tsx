import { Layout, Typography, Card, Row, Col, Space, Statistic } from 'antd';
import { BookOutlined, HistoryOutlined, UserOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const stats = {
    totalQuestions: 1280,
    completedQuestions: 168,
    accuracy: 85,
    streak: 7
  };

  return (
    <div className="home-container">
      <div className="welcome-section">
        <Title level={2}>欢迎使用在线题库系统</Title>
        <Text type="secondary">准备好提升自己了吗？开始今天的练习吧！</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card gradient-card">
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>总题目数</span>}
              value={stats.totalQuestions}
              valueStyle={{ color: '#fff' }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card gradient-card-warm">
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>已完成</span>}
              value={stats.completedQuestions}
              valueStyle={{ color: '#fff' }}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card gradient-card-cool">
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>正确率</span>}
              value={stats.accuracy}
              valueStyle={{ color: '#fff' }}
              prefix={<StarOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" style={{ background: 'linear-gradient(135deg, #845EC2 0%, #7251B5 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>连续打卡</span>}
              value={stats.streak}
              valueStyle={{ color: '#fff' }}
              prefix={<UserOutlined />}
              suffix="天"
            />
          </Card>
        </Col>
      </Row>

      <div className="section-title" style={{ margin: '48px 0 24px' }}>
        <Title level={3}>推荐题库</Title>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => navigate('/question-banks')}
            cover={
              <div style={{ 
                height: 160, 
                background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta
              title="算法与数据结构"
              description="包含经典算法题目和数据结构相关问题"
            />
            <div style={{ marginTop: 16 }}>
              <Space size="large">
                <Text type="secondary">题目数: 128</Text>
                <Text type="secondary">难度: 中等</Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => navigate('/question-banks')}
            cover={
              <div style={{ 
                height: 160, 
                background: 'linear-gradient(135deg, #FF9B9B 0%, #FF6B6B 100%)',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta
              title="前端开发基础"
              description="涵盖 HTML、CSS、JavaScript 核心知识"
            />
            <div style={{ marginTop: 16 }}>
              <Space size="large">
                <Text type="secondary">题目数: 96</Text>
                <Text type="secondary">难度: 入门</Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => navigate('/question-banks')}
            cover={
              <div style={{ 
                height: 160, 
                background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7AF 100%)',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta
              title="计算机网络"
              description="网络协议、架构及常见面试题"
            />
            <div style={{ marginTop: 16 }}>
              <Space size="large">
                <Text type="secondary">题目数: 85</Text>
                <Text type="secondary">难度: 高级</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 