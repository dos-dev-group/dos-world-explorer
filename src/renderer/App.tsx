import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Typography } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useOutlet,
  useOutletContext,
  useResolvedPath,
  useMatch,
  useLocation,
} from 'react-router-dom';
// import './App.css';
import { Flex } from './components/styledComponents';
import Favorite from './features/favorite/Favorite';
import Home from './features/home/Home';
import WorldList from './features/world/WorldList';

const { Header, Sider } = Layout;
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
  console.log('location', location);

  // let menuKey = '';
  // if ()

  return (
    <Flex css={{ minHeight: '100vh' }}>
      <Layout>
        <Sider>
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
                icon: <PieChartOutlined />,
                onClick(ev) {
                  navigate('/');
                },
              },
              {
                label: 'World',
                key: 'world',
                icon: <DesktopOutlined />,
                onClick(ev) {
                  navigate('/world');
                },
              },
              {
                label: 'Favorites',
                key: 'favorite',
                icon: <UserOutlined />,
                onClick(ev) {
                  navigate('/favorite');
                },
              },
            ]}
          />
        </Sider>
        <Layout>
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
          <Route path="world" element={<WorldList />} />
          <Route path="favorite" element={<Favorite />} />
        </Route>
      </Routes>
    </Router>
  );
}
