import { useState, useEffect } from 'react';
import { Layout, Typography, Card, Radio, Button, Space, Progress } from 'antd';
import { ClockCircleOutlined, StarOutlined, StarFilled } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

// 模拟题目数据
const mockQuestions = [
  {
    id: 1,
    question: '以下关于进程和线程的说法，错误的是：',
    options: [
      'A. 进程是资源分配的基本单位',
      'B. 线程是CPU调度的基本单位',
      'C. 线程之间共享进程的资源',
      'D. 进程之间共享内存空间'
    ],
    answer: 'D',
    explanation: '进程之间是独立的地址空间，不共享内存空间。线程之间共享所属进程的资源。'
  },
  // 更多题目...
];

const Practice = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120分钟
  const [isFinished, setIsFinished] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = value;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
    // TODO: 提交答案到服务器
  };

  const toggleFavorite = (questionId: number) => {
    setFavorites(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const question = mockQuestions[currentQuestion];

  return (
    <Layout className="practice-layout">
      <Content style={{ padding: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Title level={2}>练习模式</Title>
          <Space>
            <ClockCircleOutlined />
            <Text>{formatTime(timeLeft)}</Text>
            <Progress 
              percent={Math.round((currentQuestion + 1) / mockQuestions.length * 100)} 
              style={{ width: 200 }} 
            />
          </Space>
        </div>

        <Card
          title={`第 ${currentQuestion + 1} 题`}
          extra={
            <Button
              type="text"
              icon={favorites.includes(question.id) ? <StarFilled /> : <StarOutlined />}
              onClick={() => toggleFavorite(question.id)}
            />
          }
        >
          <div style={{ marginBottom: '2rem' }}>
            <Text>{question.question}</Text>
          </div>

          <Radio.Group
            onChange={(e) => handleAnswer(e.target.value)}
            value={selectedAnswers[currentQuestion]}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {question.options.map((option, index) => (
                <Radio key={index} value={option[0]} style={{ marginBottom: '1rem' }}>
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>

          {isFinished && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
              <Text type={selectedAnswers[currentQuestion] === question.answer ? 'success' : 'danger'}>
                正确答案：{question.answer}
              </Text>
              <div style={{ marginTop: '1rem' }}>
                <Text type="secondary">{question.explanation}</Text>
              </div>
            </div>
          )}
        </Card>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handlePrev} disabled={currentQuestion === 0}>
            上一题
          </Button>
          <Space>
            {!isFinished && (
              <Button type="primary" onClick={handleSubmit}>
                提交答案
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              disabled={currentQuestion === mockQuestions.length - 1}
            >
              下一题
            </Button>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default Practice; 