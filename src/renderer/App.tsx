import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Typography } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
// import './App.css';
import { Flex } from './components/styledComponents';

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
function Home() {
  return (
    <Flex css={{ minHeight: '100vh' }}>
      <Layout>
        <Sider>
          <Title level={4} style={{ color: 'white', textAlign: 'center' }}>
            DOS WORLD EXPLORER
          </Title>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={[
              { label: 'Option 1', key: '1', icon: <PieChartOutlined /> },
              { label: 'Option 2', key: '2', icon: <DesktopOutlined /> },
              { label: 'Option 3', key: '3', icon: <UserOutlined /> },
            ]}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
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
          </Content>
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
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
