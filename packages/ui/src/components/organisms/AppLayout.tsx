import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useAuth } from 'react-oidc-context';
import { Header, Sidebar, SubscriptionSelector } from '@/components/molecules';
import { useAuthStore } from '@/stores';
import { AuthService } from '@/services';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user: oidcUser } = useAuth();
  const { 
    user, 
    subscriptions, 
    setUser, 
    setSubscriptions, 
    setLoading, 
    setError 
  } = useAuthStore();

  const authService = AuthService.getInstance();

  useEffect(() => {
    if (oidcUser) {
      authService.setUser(oidcUser);
      loadUserData();
    }
  }, [oidcUser]);

  const loadUserData = async () => {
    if (!oidcUser) return;

    setLoading(true);
    try {
      // Load user profile
      const userProfile = await authService.getUserProfile();
      if (userProfile) {
        setUser(userProfile);

        // Load subscriptions
        const userSubscriptions = await authService.getSubscriptions();
        setSubscriptions(userSubscriptions);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Check if user has monitoring access
  const hasMonitoringAccess = user ? authService.hasMonitoringAccess(user) : false;

  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout>
        <Sidebar />
        <Layout>
          <SubscriptionSelector 
            subscriptions={subscriptions}
            loading={false}
          />
          <Content className="p-6 bg-gray-50">
            {hasMonitoringAccess ? (
              children
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Access Required
                  </h2>
                  <p className="text-gray-500">
                    You need to be a member of the 'az_monitoring' group to access this application.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Please contact your administrator to request access.
                  </p>
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};