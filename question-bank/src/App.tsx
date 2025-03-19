import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Layout, Menu } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BookOutlined, HistoryOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Home from './pages/Home';
import QuestionBanks from './pages/QuestionBanks';
import Practice from './pages/Practice';
import './App.css';

const { Header, Content } = Layout;

const theme = {
  token: {
    colorPrimary: '#4A90E2',
    borderRadius: 8,
    colorBgContainer: '#fff',
    colorBgLayout: '#F8F9FA',
  },
};

function App() {
  return (
    <ConfigProvider theme={theme} locale={zhCN}>
      <Router>
        <Layout className="app-layout">
          <Header className="app-header">
            <div className="logo">
              <Link to="/">在线题库系统</Link>
            </div>
            <Menu mode="horizontal" className="nav-menu">
              <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="banks" icon={<BookOutlined />}>
                <Link to="/question-banks">题库</Link>
              </Menu.Item>
              <Menu.Item key="history" icon={<HistoryOutlined />}>
                <Link to="/history">历史</Link>
              </Menu.Item>
              <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">我的</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/question-banks" element={<QuestionBanks />} />
              <Route path="/practice/:id" element={<Practice />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
