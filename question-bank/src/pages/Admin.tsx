import { useState } from 'react';
import { Layout, Typography, Card, Upload, Button, Table, Tag, Space, Modal, Form, Input, Select } from 'antd';
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import './Admin.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface QuestionBank {
  id: string;
  title: string;
  company: string;
  category: string;
  questionCount: number;
  difficulty: string;
  updateTime: string;
}

const Admin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟题库数据
  const mockData: QuestionBank[] = [
    {
      id: '1',
      title: '字节跳动后端开发2024届实习生笔试题',
      company: '字节跳动',
      category: '后端开发',
      questionCount: 30,
      difficulty: '中等',
      updateTime: '2024-03-18'
    },
    // 更多题库数据...
  ];

  const columns = [
    {
      title: '题库名称',
      dataIndex: 'title',
      key: 'title',
      width: 300,
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
      width: 120,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: '题目数量',
      dataIndex: 'questionCount',
      key: 'questionCount',
      width: 100,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty: string) => {
        const color = 
          difficulty === '简单' ? 'green' :
          difficulty === '中等' ? 'orange' : 'red';
        return <Tag color={color}>{difficulty}</Tag>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: QuestionBank) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/admin/import-questions',
    accept: '.xlsx,.xls,.csv',
    onChange(info) {
      if (info.file.status === 'done') {
        Modal.success({
          content: '题库导入成功！',
        });
      } else if (info.file.status === 'error') {
        Modal.error({
          content: '题库导入失败，请检查文件格式！',
        });
      }
    },
  };

  const handleAddBank = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="admin-container">
      <Card className="admin-card">
        <div className="admin-header">
          <Title level={3}>题库管理</Title>
          <Space size="middle">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>导入题库</Button>
            </Upload>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBank}>
              新增题库
            </Button>
          </Space>
        </div>

        <div className="admin-content">
          <Table 
            columns={columns} 
            dataSource={mockData}
            rowKey="id"
            pagination={{
              total: mockData.length,
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </div>
      </Card>

      <Modal
        title="新增题库"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="题库名称"
            rules={[{ required: true, message: '请输入题库名称' }]}
          >
            <Input placeholder="请输入题库名称" />
          </Form.Item>

          <Form.Item
            name="company"
            label="公司"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              <Option value="frontend">前端开发</Option>
              <Option value="backend">后端开发</Option>
              <Option value="algorithm">算法</Option>
              <Option value="database">数据库</Option>
              <Option value="network">计算机网络</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="难度"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select placeholder="请选择难度">
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="题库描述"
          >
            <Input.TextArea rows={4} placeholder="请输入题库描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin; 