import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { 
  InboxOutlined, 
  DatabaseOutlined, 
  FunctionOutlined, 
  KeyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
  // Mock data - in real implementation, this would come from API calls
  const stats = {
    storageAccounts: 12,
    cosmosAccounts: 5,
    functionApps: 8,
    keyVaults: 3,
    activeFunctions: 24,
    expiringCerts: 2,
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={2}>Dashboard</Title>
        <Text type="secondary">
          Overview of your Azure infrastructure monitoring
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Storage Accounts"
              value={stats.storageAccounts}
              prefix={<InboxOutlined className="text-azure-500" />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cosmos DB Accounts"
              value={stats.cosmosAccounts}
              prefix={<DatabaseOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Function Apps"
              value={stats.functionApps}
              prefix={<FunctionOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Key Vaults"
              value={stats.keyVaults}
              prefix={<KeyOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Function Apps Status" className="h-full">
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <CheckCircleOutlined className="text-green-500" />
                  <Text>Active Functions</Text>
                </div>
                <Text strong>{stats.activeFunctions}</Text>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <ClockCircleOutlined className="text-yellow-500" />
                  <Text>Pending</Text>
                </div>
                <Text strong>3</Text>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <ClockCircleOutlined className="text-red-500" />
                  <Text>Failed</Text>
                </div>
                <Text strong>1</Text>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Certificates Expiring Soon" className="h-full">
            <Space direction="vertical" className="w-full">
              {stats.expiringCerts > 0 ? (
                <>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <div>
                      <Text strong>SSL Certificate - webapp.contoso.com</Text>
                      <br />
                      <Text type="secondary" className="text-sm">
                        Expires in 15 days
                      </Text>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <div>
                      <Text strong>API Certificate - api.contoso.com</Text>
                      <br />
                      <Text type="secondary" className="text-sm">
                        Expires in 28 days
                      </Text>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleOutlined className="text-green-500 text-2xl mb-2" />
                  <br />
                  <Text type="secondary">All certificates are valid</Text>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};