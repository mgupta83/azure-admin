export interface KeyVault {
  id: string;
  name: string;
  resourceGroup: string;
  location: string;
  tags: Record<string, string>;
  vaultUri: string;
}

export interface Certificate {
  name: string;
  enabled: boolean;
  created: Date;
  updated: Date;
  expires: Date;
  notBefore: Date;
  subject: string;
  issuer: string;
  thumbprint: string;
  keyType: string;
  keySize: number;
  tags: Record<string, string>;
}

export interface Secret {
  name: string;
  enabled: boolean;
  created: Date;
  updated: Date;
  expires?: Date;
  notBefore?: Date;
  contentType?: string;
  tags: Record<string, string>;
  value?: string; // Only populated when explicitly requested
}

export interface KeyVaultAccessPolicy {
  tenantId: string;
  objectId: string;
  permissions: {
    keys: string[];
    secrets: string[];
    certificates: string[];
  };
}