import { KeyVault, Certificate, Secret, FilterOptions } from '@/types';
import { AuthService } from './auth.service';
import { azureEndpoints } from './auth.config';

export class KeyVaultService {
  private authService = AuthService.getInstance();

  async getKeyVaults(subscriptionId: string, filters?: FilterOptions): Promise<KeyVault[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/providers/Microsoft.KeyVault/vaults?api-version=2023-02-01`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch key vaults');
      }

      const data = await response.json();
      let keyVaults: KeyVault[] = data.value.map((vault: any) => ({
        id: vault.id,
        name: vault.name,
        resourceGroup: vault.id.split('/')[4],
        location: vault.location,
        tags: vault.tags || {},
        vaultUri: vault.properties.vaultUri,
      }));

      // Apply filters
      if (filters) {
        keyVaults = this.applyFilters(keyVaults, filters);
      }

      return keyVaults;
    } catch (error) {
      console.error('Error fetching key vaults:', error);
      throw error;
    }
  }

  async getCertificates(vaultName: string): Promise<Certificate[]> {
    // Note: This requires direct access to Key Vault
    // In a production environment, you'd use Azure Key Vault SDK with proper authentication
    console.warn('getCertificates requires direct Key Vault access - implement with Azure Key Vault SDK');
    
    // Placeholder implementation
    return [];
  }

  async getSecrets(vaultName: string, nameFilter?: string): Promise<Secret[]> {
    // Note: This requires direct access to Key Vault
    // In a production environment, you'd use Azure Key Vault SDK with proper authentication
    console.warn('getSecrets requires direct Key Vault access - implement with Azure Key Vault SDK');
    
    // Placeholder implementation
    return [];
  }

  async getSecretValue(vaultName: string, secretName: string): Promise<string> {
    // Note: This requires direct access to Key Vault
    // In a production environment, you'd use Azure Key Vault SDK with proper authentication
    console.warn('getSecretValue requires direct Key Vault access - implement with Azure Key Vault SDK');
    
    throw new Error('getSecretValue requires direct Key Vault access');
  }

  // Helper method to get certificates that are expiring soon
  getCertificatesExpiringSoon(certificates: Certificate[], days: number = 30): Certificate[] {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    
    return certificates
      .filter(cert => cert.expires <= threshold)
      .sort((a, b) => a.expires.getTime() - b.expires.getTime());
  }

  private applyFilters(keyVaults: KeyVault[], filters: FilterOptions): KeyVault[] {
    return keyVaults.filter(vault => {
      if (filters.nameFilter && !vault.name.toLowerCase().includes(filters.nameFilter.toLowerCase())) {
        return false;
      }
      
      if (filters.environment && vault.tags.environment !== filters.environment) {
        return false;
      }
      
      if (filters.application && vault.tags.application !== filters.application) {
        return false;
      }
      
      if (filters.resourceGroup && vault.resourceGroup !== filters.resourceGroup) {
        return false;
      }
      
      return true;
    });
  }
}