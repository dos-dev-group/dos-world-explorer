import {
  AuditOutlined,
  ExperimentOutlined,
  EyeOutlined,
  GlobalOutlined,
  HeartOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  StarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Spin, Typography } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import { ReactElement, ReactNode, Suspense, useEffect } from 'react';
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
import { Flex, FlexCenter } from './components/styledComponents';
import { useVrcCurrentUser } from './data/user';
import BookmarkPage from './features/bookmark/BookmarkPage';
import FriendsPage from './features/friends/FriendsPage';
import Home from './features/home/Home';
import LoginPage from './features/login/LoginPage';
import WorldExplorePage from './features/world-explore/WorldExplorePage';
import WorldFavoritePage from './features/world-favorite/WorldFavoritePage';
import WorldSheetPage from './features/world-sheet/WorldSheetPage';

const { Sider } = Layout;
const { Title } = Typography;

export default function App() {
  const { currentUser } = useVrcCurrentUser();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <MenuLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/sheet" />} />
          <Route path="sheet" element={<WorldSheetPage />} />
          <Route path="bookmark" element={<BookmarkPage />} />
          <Route path="explore" element={<WorldExplorePage />} />
          <Route path="favorite" element={<WorldFavoritePage />} />
          <Route
            path="friends"
            element={
              <Suspense
                fallback={
                  <FlexCenter>
                    <Spin />
                  </FlexCenter>
                }
              >
                <FriendsPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

function MenuLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useVrcCurrentUser();

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
              {
                label: 'Explore',
                key: 'explore',
                icon: <EyeOutlined />,
                onClick(ev) {
                  navigate('/explore');
                },
              },
              {
                label: 'VRC Favorite',
                key: 'favorite',
                icon: <StarOutlined />,
                onClick(ev) {
                  navigate('/favorite');
                },
              },
              {
                label: 'Friends',
                key: 'friends',
                icon: <TeamOutlined />,
                onClick(ev) {
                  navigate('/friends');
                },
              },
              {
                type: 'divider',
              },
              {
                disabled: true,
                key: 'user_info',
                icon: (
                  <img
                    src={currentUser?.currentAvatarThumbnailImageUrl}
                    width={32}
                    height={32}
                    css={{ borderRadius: 16, objectFit: 'cover' }}
                    alt=""
                  />
                ),
                label: <b>{currentUser?.displayName}</b>,
              },
              {
                label: 'Logout',
                key: 'logout',
                icon: <LogoutOutlined />,
                danger: true,
                onClick(ev) {
                  logout();
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
