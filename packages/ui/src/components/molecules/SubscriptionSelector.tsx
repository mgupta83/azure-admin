import React from 'react';
import { Select, Space, Typography } from 'antd';
import { CloudOutlined, FolderOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores';
import { AzureSubscription } from '@/types';

const { Text } = Typography;
const { Option } = Select;

interface SubscriptionSelectorProps {
  subscriptions: AzureSubscription[];
  loading?: boolean;
}

export const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  subscriptions,
  loading = false,
}) => {
  const { currentSubscription, setCurrentSubscription } = useAuthStore();

  const handleSubscriptionChange = (subscriptionId: string) => {
    setCurrentSubscription(subscriptionId);
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <Space direction="vertical" className="w-full">
        <div className="flex items-center space-x-2">
          <CloudOutlined className="text-azure-500" />
          <Text strong>Azure Context</Text>
        </div>
        
        <div>
          <Text className="text-sm text-gray-600 block mb-1">Subscription</Text>
          <Select
            value={currentSubscription}
            onChange={handleSubscriptionChange}
            loading={loading}
            placeholder="Select subscription..."
            className="w-full"
            showSearch
            optionFilterProp="children"
          >
            {subscriptions.map(sub => (
              <Option key={sub.subscriptionId} value={sub.subscriptionId}>
                <div>
                  <div className="font-medium">{sub.displayName}</div>
                  <div className="text-xs text-gray-500">{sub.subscriptionId}</div>
                </div>
              </Option>
            ))}
          </Select>
        </div>
      </Space>
    </div>
  );
};