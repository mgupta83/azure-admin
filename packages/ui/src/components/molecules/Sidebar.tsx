import React from 'react';
import { Layout, Menu, type MenuProps } from 'antd';
import { 
  DatabaseOutlined, 
  CloudServerOutlined, 
  FunctionOutlined,
  KeyOutlined,
  InboxOutlined,
  HomeOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/storage',
      icon: <InboxOutlined />,
      label: 'Storage',
      children: [
        {
          key: '/storage/blobs',
          label: 'Blobs',
        },
        {
          key: '/storage/queues',
          label: 'Queues',
        },
      ],
    },
    {
      key: '/cosmos',
      icon: <DatabaseOutlined />,
      label: 'Cosmos DB',
    },
    {
      key: '/functions',
      icon: <FunctionOutlined />,
      label: 'Function Apps',
    },
    {
      key: '/keyvault',
      icon: <KeyOutlined />,
      label: 'Key Vault',
      children: [
        {
          key: '/keyvault/certificates',
          label: 'Certificates',
        },
        {
          key: '/keyvault/secrets',
          label: 'Secrets',
        },
      ],
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    // Find the most specific match
    const allKeys = getAllMenuKeys(menuItems);
    const exactMatch = allKeys.find(key => key === path);
    if (exactMatch) return [exactMatch];
    
    // Find parent match
    const parentMatch = allKeys
      .filter(key => path.startsWith(key) && key !== '/')
      .sort((a, b) => b.length - a.length)[0];
    
    return parentMatch ? [parentMatch] : ['/'];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    const openKeys = [];
    
    if (path.startsWith('/storage')) openKeys.push('/storage');
    if (path.startsWith('/keyvault')) openKeys.push('/keyvault');
    
    return openKeys;
  };

  return (
    <Sider
      width={250}
      className="bg-white border-r border-gray-200"
      theme="light"
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-none"
      />
    </Sider>
  );
};

function getAllMenuKeys(items: MenuItem[]): string[] {
  const keys: string[] = [];
  
  const traverse = (menuItems: MenuItem[]) => {
    menuItems.forEach(item => {
      if (item && typeof item === 'object' && 'key' in item) {
        keys.push(item.key as string);
        if ('children' in item && item.children) {
          traverse(item.children);
        }
      }
    });
  };
  
  traverse(items);
  return keys;
}