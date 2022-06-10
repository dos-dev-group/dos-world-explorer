import {
  GlobalOutlined,
  HeartOutlined,
  HomeOutlined,
  LogoutOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';
// import './App.css';
import { Flex } from './components/styledComponents';
import BookmarkPage from './features/bookmark/BookmarkPage';
import Home from './features/home/Home';
import LoginPage from './features/login/LoginPage';
import SearchPage from './features/search/SearchPage';

const { Sider } = Layout;
const { Title } = Typography;

// const Hello = () => {
//   return (
//     <div>
//       <div className="Hello">
//         <img width="200px" alt="icon" src={icon} />
//       </div>
//       <h1>electron-react-boilerplate</h1>
//       <div className="Hello">
//         <a
//           href="https://electron-react-boilerplate.js.org/"
//           target="_blank"
//           rel="noreferrer"
//         >
//           <button type="button">
//             <span role="img" aria-label="books">
//               📚
//             </span>
//             Read our docs
//           </button>
//         </a>
//         <a
//           href="https://github.com/sponsors/electron-react-boilerplate"
//           target="_blank"
//           rel="noreferrer"
//         >
//           <button type="button">
//             <span role="img" aria-label="books">
//               🙏
//             </span>
//             Donate
//           </button>
//         </a>
//       </div>
//     </div>
//   );
// };
/* <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Dos</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              Dos Chat is Dos Gang.
            </div>
          </Content> */

function MenuLayout() {
  const navigate = useNavigate();
  const location = useLocation();

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
            DOS WORLD EXPLORER
          </Title>
          <Menu
            theme="dark"
            defaultSelectedKeys={['home']}
            mode="inline"
            items={[
              {
                label: 'Home',
                key: 'home',
                icon: <HomeOutlined />,
                onClick(ev) {
                  navigate('/');
                },
              },
              {
                label: 'World',
                key: 'world',
                icon: <GlobalOutlined />,
                onClick(ev) {
                  navigate('/world');
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
              // {
              //   label: 'Logout',
              //   key: 'login',
              //   icon: <LogoutOutlined />,
              //   onClick(ev) {
              //     navigate('/login');
              //   },
              // },
            ]}
          />
        </Sider>
        <Layout css={{ marginLeft: 200 }}>
          <Outlet />
          <Footer style={{ textAlign: 'center' }}>
            Dos Gang Application ©2022 Created by Dos Chat
          </Footer>
        </Layout>
      </Layout>
    </Flex>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuLayout />}>
          <Route index element={<Home />} />
          <Route path="world" element={<SearchPage />} />
          <Route path="bookmark" element={<BookmarkPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
