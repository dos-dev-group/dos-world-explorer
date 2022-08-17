import {
  AuditOutlined,
  GlobalOutlined,
  HeartOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import { ReactElement, ReactNode, useEffect } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
// import './App.css';
import { Flex } from './components/styledComponents';
import { userLoginState } from './data/user';
import BookmarkPage from './features/bookmark/BookmarkPage';
import Home from './features/home/Home';
import LoginPage from './features/login/LoginPage';
import WorldSheetPage from './features/world-sheet/WorldSheetPage';
import { loginToMain } from './utils/ipc/vrchatAPIToMain';

const { Sider } = Layout;
const { Title } = Typography;

export default function App() {
  const recoilUserLoginState = useRecoilValue(userLoginState);

  return (
    <Flex css={{ width: '100vw', height: '100vh' }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              recoilUserLoginState ? <MenuLayout /> : <Navigate to="/login" />
            }
          >
            <Route index element={<Navigate to="/sheet" />} />
            <Route path="sheet" element={<WorldSheetPage />} />
            <Route path="bookmark" element={<BookmarkPage />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Router>
    </Flex>
  );
}

function MenuLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const recoilLoginState = useRecoilValue(userLoginState);
  const recoilLoginStateResetter = useResetRecoilState(userLoginState);

  // let menuKey = '';
  // if ()

  return (
    <Flex css={{ minHeight: '100vh' }}>
      <Layout>
        <Sider
          css={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Title level={4} style={{ color: 'white', textAlign: 'center' }}>
            VRCExplorer
          </Title>
          <Menu
            theme="dark"
            defaultSelectedKeys={['sheet']}
            mode="inline"
            items={[
              // {
              //   label: 'Home',
              //   key: 'home',
              //   icon: <HomeOutlined />,
              //   onClick(ev) {
              //     navigate('/');
              //   },
              // },
              {
                label: 'Sheet',
                key: 'sheet',
                icon: <AuditOutlined />,
                onClick(ev) {
                  navigate('/sheet');
                },
              },
              {
                label: 'Bookmarks',
                key: 'bookmark',
                icon: <HeartOutlined />,
                onClick(ev) {
                  navigate('/bookmark');
                },
              },
              // TODO: 로그인 UI 구현
              recoilLoginState
                ? {
                    label: 'Logout',
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    onClick(ev) {
                      recoilLoginStateResetter();
                    },
                  }
                : {
                    label: 'Login',
                    key: 'login',
                    icon: <LoginOutlined />,
                    onClick(ev) {
                      navigate('/login');
                    },
                  },
            ]}
          />
        </Sider>
        <Layout css={{ marginLeft: 200 }}>
          <Outlet />
          <Footer style={{ textAlign: 'center' }}>
            VRCExplorer Created by Dos Chat
          </Footer>
        </Layout>
      </Layout>
    </Flex>
  );
}
