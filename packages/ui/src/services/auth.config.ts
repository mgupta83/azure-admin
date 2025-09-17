import { WebStorageStateStore } from 'oidc-client-ts';

export const oidcConfig = {
  authority: 'https://login.microsoftonline.com/common/v2.0',
  client_id: process.env.VITE_AZURE_CLIENT_ID || 'your-client-id',
  redirect_uri: window.location.origin + '/callback',
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile email https://graph.microsoft.com/User.Read https://management.azure.com/user_impersonation',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  loadUserInfo: true,
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: false,
  monitorSession: true,
  checkSessionInterval: 60000, // 1 minute
  revokeAccessTokenOnSignout: true,
  extraQueryParams: {
    prompt: 'select_account',
  },
};

export const azureScopes = {
  userRead: 'https://graph.microsoft.com/User.Read',
  userReadBasicAll: 'https://graph.microsoft.com/User.ReadBasic.All',
  directoryReadAll: 'https://graph.microsoft.com/Directory.Read.All',
  azureManagement: 'https://management.azure.com/user_impersonation',
  storage: 'https://storage.azure.com/user_impersonation',
  keyVault: 'https://vault.azure.net/user_impersonation',
} as const;

export const requiredScopes = [
  azureScopes.userRead,
  azureScopes.azureManagement,
  azureScopes.storage,
  azureScopes.keyVault,
];

export const azureEndpoints = {
  graph: 'https://graph.microsoft.com/v1.0',
  management: 'https://management.azure.com',
  storage: 'https://management.azure.com/subscriptions',
  keyVault: 'https://vault.azure.net',
} as const;