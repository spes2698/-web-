import { useState } from 'react';
import { Layout, Typography, Card, Row, Col, Input, Tag, Space } from 'antd';
import { SearchOutlined, StarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

// 模拟题库数据
const mockQuestionBanks = [
  {
    id: 1,
    title: '字节跳动后端开发实习生笔试题',
    description: '包含算法、数据结构、操作系统等题目',
    totalQuestions: 30,
    timeLimit: 120,
    tags: ['算法', '后端', '实习']
  },
  {
    id: 2,
    title: '阿里巴巴前端开发实习生笔试题',
    description: 'JavaScript、React、计算机网络等题目',
    totalQuestions: 25,
    timeLimit: 90,
    tags: ['前端', 'JavaScript', '实习']
  },
  // 更多题库...
];

const QuestionBanks = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (value: string) => {
    setSearchText(value);
    // TODO: 实现搜索功能
  };

  return (
    <Layout className="question-banks-layout">
      <Content style={{ padding: '50px' }}>
        <Title level={2}>题库列表</Title>
        
        <Search
          placeholder="搜索题库"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ marginBottom: '2rem' }}
        />
        
        <Row gutter={[16, 16]}>
          {mockQuestionBanks.map(bank => (
            <Col key={bank.id} span={8}>
              <Card
                hoverable
                title={bank.title}
                extra={<StarOutlined />}
                onClick={() => window.location.href = `/practice/${bank.id}`}
              >
                <p>{bank.description}</p>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    题目数量: {bank.totalQuestions}
                    <ClockCircleOutlined style={{ marginLeft: '1rem' }} />
                    {bank.timeLimit}分钟
                  </div>
                  <div>
                    {bank.tags.map(tag => (
                      <Tag key={tag} color="blue" style={{ marginRight: '8px' }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default QuestionBanks; 