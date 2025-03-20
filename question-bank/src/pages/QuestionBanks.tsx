import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Switch, Space, Tag, message, Progress, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { QuestionBank } from '../types/question-bank';
import questionBankApi from '../services/question-bank';

const { Option } = Select;

const QuestionBanks: React.FC = () => {
  const [form] = Form.useForm();
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'validating' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [importErrors, setImportErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchQuestionBanks();
  }, [pagination.current, pagination.pageSize]);

  const fetchQuestionBanks = async () => {
    try {
      const response = await questionBankApi.getList({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      if (response.success) {
        setQuestionBanks(response.data.items);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
        }));
      }
    } catch (error) {
      console.error('获取题库列表失败:', error);
      message.error('获取题库列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBank(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: QuestionBank) => {
    setEditingBank(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await questionBankApi.delete(id);
      if (response.success) {
        message.success('删除成功');
        fetchQuestionBanks();
      }
    } catch (error) {
      console.error('删除题库失败:', error);
      message.error('删除题库失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = editingBank
        ? await questionBankApi.update(editingBank.id, values)
        : await questionBankApi.create(values);
      
      if (response.success) {
        message.success(editingBank ? '更新成功' : '创建成功');
        setModalVisible(false);
        fetchQuestionBanks();
      }
    } catch (error) {
      console.error('保存题库失败:', error);
      message.error('保存题库失败');
    }
  };

  const handleImport = async (file: File) => {
    try {
      setImportStatus('validating');
      setImportProgress(0);
      setImportErrors([]);

      // 验证数据
      const validationResult = await questionBankApi.validateImportData({ file });
      if (!validationResult.success || !validationResult.data.isValid) {
        setImportErrors(validationResult.data.errors.map(e => `第${e.row}行: ${e.message}`));
        setImportStatus('error');
        return;
      }

      // 上传文件
      setImportStatus('uploading');
      const response = await questionBankApi.importQuestionsWithProgress(
        { file },
        (progress) => setImportProgress(progress)
      );

      if (response.success) {
        setImportStatus('processing');
        // 轮询导入进度
        const taskId = response.data.taskId;
        const pollProgress = async () => {
          const progressResponse = await questionBankApi.getImportProgress(taskId);
          if (progressResponse.success) {
            const { status, progress, errors } = progressResponse.data;
            setImportProgress(progress);
            
            if (status === 'completed') {
              setImportStatus('completed');
              message.success('导入成功');
              fetchQuestionBanks();
            } else if (status === 'failed') {
              setImportStatus('error');
              setImportErrors(errors || ['导入失败']);
            } else {
              setTimeout(pollProgress, 1000);
            }
          }
        };
        pollProgress();
      }
    } catch (error) {
      console.error('导入题库失败:', error);
      setImportStatus('error');
      setImportErrors(['导入失败，请重试']);
    }
  };

  const handleExport = async (id: string) => {
    try {
      const response = await questionBankApi.exportQuestions(id);
      if (response.success) {
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `题库_${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('导出题库失败:', error);
      message.error('导出题库失败');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await questionBankApi.getTemplate();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '题库导入模板.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载模板失败:', error);
      message.error('下载模板失败');
    }
  };

  const columns = [
    {
      title: '题库名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '题目数量',
      dataIndex: 'stats.questionCount',
      key: 'questionCount',
    },
    {
      title: '难度',
      dataIndex: 'metadata.difficulty',
      key: 'difficulty',
      render: (difficulty: string) => (
        <Tag color={
          difficulty === 'easy' ? 'green' :
          difficulty === 'medium' ? 'orange' : 'red'
        }>
          {difficulty === 'easy' ? '简单' :
           difficulty === 'medium' ? '中等' : '困难'}
        </Tag>
      ),
    },
    {
      title: '可见性',
      dataIndex: 'visibility',
      key: 'visibility',
      render: (visibility: string) => (
        <Tag color={
          visibility === 'public' ? 'blue' :
          visibility === 'private' ? 'red' : 'orange'
        }>
          {visibility === 'public' ? '公开' :
           visibility === 'private' ? '私有' : '共享'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: QuestionBank) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleExport(record.id)}
          >
            导出
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="题库管理"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              创建题库
            </Button>
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleDownloadTemplate}
            >
              下载模板
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => document.getElementById('importInput')?.click()}
            >
              导入题库
            </Button>
            <input
              id="importInput"
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImport(file);
                }
              }}
            />
          </Space>
        }
      >
        {importStatus !== 'idle' && (
          <div className="mb-4">
            <Alert
              message={
                importStatus === 'validating' ? '正在验证数据...' :
                importStatus === 'uploading' ? '正在上传文件...' :
                importStatus === 'processing' ? '正在处理数据...' :
                importStatus === 'completed' ? '导入完成' :
                '导入失败'
              }
              type={
                importStatus === 'completed' ? 'success' :
                importStatus === 'error' ? 'error' : 'info'
              }
            />
            <Progress
              percent={importProgress}
              status={importStatus === 'error' ? 'exception' : 'active'}
              className="mt-2"
            />
            {importErrors.length > 0 && (
              <div className="mt-2">
                {importErrors.map((error, index) => (
                  <div key={index} className="text-red-500">{error}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={questionBanks}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
        />
      </Card>

      <Modal
        title={editingBank ? '编辑题库' : '创建题库'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="题库名称"
            rules={[{ required: true, message: '请输入题库名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入题库描述' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="visibility"
            label="可见性"
            rules={[{ required: true, message: '请选择可见性' }]}
          >
            <Select>
              <Option value="private">私有</Option>
              <Option value="public">公开</Option>
              <Option value="shared">共享</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['metadata', 'difficulty']}
            label="难度"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select>
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['metadata', 'estimatedTime']}
            label="预计完成时间(分钟)"
            rules={[{ required: true, message: '请输入预计完成时间' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name={['settings', 'shuffleQuestions']}
            label="随机出题"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name={['settings', 'showAnswers']}
            label="显示答案"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name={['settings', 'timeLimit']}
            label="时间限制(分钟)"
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name={['settings', 'passScore']}
            label="及格分数"
            rules={[{ required: true, message: '请输入及格分数' }]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionBanks; 