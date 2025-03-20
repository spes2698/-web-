import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Select, DatePicker, Space } from 'antd';
import { Line, Pie, Bar } from '@ant-design/charts';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { UserStatistics } from '../types/user';
import userApi from '../services/user';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      const response = await userApi.getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD')
      ]);
    } else {
      setDateRange(null);
    }
  };

  // 学习趋势图配置
  const trendConfig = {
    data: statistics?.daily || [],
    xField: 'date',
    yField: 'questionCount',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  // 错题分布图配置
  const wrongQuestionsConfig = {
    data: statistics?.categories || [],
    angleField: 'questionCount',
    colorField: 'categoryId',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}%',
    },
  };

  // 题目类型分布图配置
  const questionTypesConfig = {
    data: statistics?.questionTypes || [],
    xField: 'type',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
      },
    },
  };

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        {/* 总体进度 */}
        <Col span={24}>
          <Card title="总体进度">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic
                  title="总题目数"
                  value={statistics?.progress.totalQuestions || 0}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="已完成"
                  value={statistics?.progress.completedQuestions || 0}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="已掌握"
                  value={statistics?.progress.masteredQuestions || 0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="待加强"
                  value={statistics?.progress.weakQuestions || 0}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
            </Row>
            <div className="mt-4">
              <Progress
                percent={statistics?.progress.averageAccuracy || 0}
                status="active"
              />
            </div>
          </Card>
        </Col>

        {/* 学习趋势 */}
        <Col span={16}>
          <Card
            title="学习趋势"
            extra={
              <Space>
                <RangePicker onChange={handleDateRangeChange} />
                <Select defaultValue="week">
                  <Option value="day">按日</Option>
                  <Option value="week">按周</Option>
                  <Option value="month">按月</Option>
                </Select>
              </Space>
            }
          >
            <Line {...trendConfig} />
          </Card>
        </Col>

        {/* 错题分布 */}
        <Col span={8}>
          <Card title="错题分布">
            <Pie {...wrongQuestionsConfig} />
          </Card>
        </Col>

        {/* 题目类型分布 */}
        <Col span={24}>
          <Card title="题目类型分布">
            <Bar {...questionTypesConfig} />
          </Card>
        </Col>

        {/* 学习记录 */}
        <Col span={24}>
          <Card title="学习记录">
            <Table
              dataSource={statistics?.daily || []}
              columns={[
                {
                  title: '日期',
                  dataIndex: 'date',
                  key: 'date',
                },
                {
                  title: '练习次数',
                  dataIndex: 'practiceCount',
                  key: 'practiceCount',
                },
                {
                  title: '答题数',
                  dataIndex: 'questionCount',
                  key: 'questionCount',
                },
                {
                  title: '正确数',
                  dataIndex: 'correctCount',
                  key: 'correctCount',
                },
                {
                  title: '用时(分钟)',
                  dataIndex: 'totalTime',
                  key: 'totalTime',
                },
                {
                  title: '目标完成',
                  dataIndex: 'completedGoal',
                  key: 'completedGoal',
                  render: (completed: boolean) => (
                    <span style={{ color: completed ? '#52c41a' : '#ff4d4f' }}>
                      {completed ? '已完成' : '未完成'}
                    </span>
                  ),
                },
              ]}
              rowKey="date"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics; 