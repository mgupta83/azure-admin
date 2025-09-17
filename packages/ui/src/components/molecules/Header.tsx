import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Space } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from 'react-oidc-context';
import { useAuthStore } from '@/stores';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export const Header: React.FC = () => {
  const { signoutRedirect } = useAuth();
  const { user } = useAuthStore();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: () => signoutRedirect(),
    },
  ];

  return (
    <AntHeader className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-azure-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <Text strong className="text-lg">Azure Admin</Text>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <Space>
            <Text type="secondary">Welcome, {user.displayName}</Text>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar
                icon={<UserOutlined />}
                className="cursor-pointer hover:bg-gray-100"
              />
            </Dropdown>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};