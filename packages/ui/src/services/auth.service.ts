import { User } from 'oidc-client-ts';
import { User as AppUser, UserPreferences, AzureSubscription } from '@/types';
import { azureEndpoints } from './auth.config';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  setUser(user: User | null): void {
    this.currentUser = user;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getAccessToken(): string | null {
    return this.currentUser?.access_token || null;
  }

  async getUserProfile(): Promise<AppUser | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch(`${azureEndpoints.graph}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profile = await response.json();
      
      // Get user's group memberships
      const groupsResponse = await fetch(`${azureEndpoints.graph}/me/memberOf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const groups = groupsResponse.ok ? await groupsResponse.json() : { value: [] };
      const groupNames = groups.value
        ?.filter((group: any) => group['@odata.type'] === '#microsoft.graph.group')
        ?.map((group: any) => group.displayName) || [];

      return {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.mail || profile.userPrincipalName,
        groups: groupNames,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  hasMonitoringAccess(user: AppUser): boolean {
    return user.groups.includes('az_monitoring');
  }

  async getSubscriptions(): Promise<AzureSubscription[]> {
    const token = this.getAccessToken();
    if (!token) return [];

    try {
      const response = await fetch(`${azureEndpoints.management}/subscriptions?api-version=2020-01-01`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      return data.value.map((sub: any) => ({
        subscriptionId: sub.subscriptionId,
        displayName: sub.displayName,
        state: sub.state,
        tenantId: sub.tenantId,
      }));
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    // In a real implementation, this would fetch from Azure Blob Storage
    // For now, we'll use localStorage as a fallback
    try {
      const stored = localStorage.getItem(`preferences_${userId}`);
      return stored ? JSON.parse(stored) : {
        quickAccessResources: [],
      };
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return { quickAccessResources: [] };
    }
  }

  async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    // In a real implementation, this would save to Azure Blob Storage
    // For now, we'll use localStorage as a fallback
    try {
      localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw new Error('Failed to save preferences');
    }
  }
}