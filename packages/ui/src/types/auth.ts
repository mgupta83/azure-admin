export interface User {
  id: string;
  displayName: string;
  email: string;
  groups: string[];
}

export interface UserPreferences {
  defaultSubscription?: string;
  defaultDirectory?: string;
  quickAccessResources: QuickAccessResource[];
}

export interface QuickAccessResource {
  id: string;
  name: string;
  type: 'storage' | 'cosmos' | 'function' | 'keyvault';
  resourceGroup: string;
}

export interface AzureSubscription {
  subscriptionId: string;
  displayName: string;
  state: string;
  tenantId: string;
}

export interface AzureDirectory {
  tenantId: string;
  displayName: string;
  domains: string[];
}