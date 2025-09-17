import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { ConfigProvider } from 'antd';
import { AppLayout, Dashboard } from '@/components';
import { oidcConfig } from '@/services';

// Placeholder components for routes
const StorageBlobs = () => <div>Storage Blobs - Coming Soon</div>;
const StorageQueues = () => <div>Storage Queues - Coming Soon</div>;
const CosmosDB = () => <div>Cosmos DB Shell - Coming Soon</div>;
const FunctionApps = () => <div>Function Apps - Coming Soon</div>;
const Certificates = () => <div>Certificates - Coming Soon</div>;
const Secrets = () => <div>Secrets - Coming Soon</div>;

const AppContent: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/storage/blobs" element={<StorageBlobs />} />
        <Route path="/storage/queues" element={<StorageQueues />} />
        <Route path="/cosmos" element={<CosmosDB />} />
        <Route path="/functions" element={<FunctionApps />} />
        <Route path="/keyvault/certificates" element={<Certificates />} />
        <Route path="/keyvault/secrets" element={<Secrets />} />
      </Routes>
    </AppLayout>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0ea5e9', // Azure blue
          borderRadius: 6,
        },
      }}
    >
      <AuthProvider {...oidcConfig}>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;