import { StorageAccount, BlobContainer, BlobItem, QueueItem, QueueMessage, FilterOptions } from '@/types';
import { AuthService } from './auth.service';
import { azureEndpoints } from './auth.config';

export class StorageService {
  private authService = AuthService.getInstance();

  async getStorageAccounts(subscriptionId: string, filters?: FilterOptions): Promise<StorageAccount[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/providers/Microsoft.Storage/storageAccounts?api-version=2023-01-01`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch storage accounts');
      }

      const data = await response.json();
      let accounts: StorageAccount[] = data.value.map((account: any) => ({
        id: account.id,
        name: account.name,
        resourceGroup: account.id.split('/')[4],
        location: account.location,
        tags: account.tags || {},
        primaryEndpoints: account.properties.primaryEndpoints,
      }));

      // Apply filters
      if (filters) {
        accounts = this.applyFilters(accounts, filters);
      }

      return accounts;
    } catch (error) {
      console.error('Error fetching storage accounts:', error);
      throw error;
    }
  }

  async getBlobContainers(storageAccountName: string, resourceGroup: string, subscriptionId: string): Promise<BlobContainer[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Storage/storageAccounts/${storageAccountName}/blobServices/default/containers?api-version=2023-01-01`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blob containers');
      }

      const data = await response.json();
      return data.value.map((container: any) => ({
        name: container.name,
        lastModified: new Date(container.properties.lastModifiedTime),
        publicAccess: container.properties.publicAccess || 'None',
        metadata: container.properties.metadata || {},
      }));
    } catch (error) {
      console.error('Error fetching blob containers:', error);
      throw error;
    }
  }

  async getBlobItems(storageAccountName: string, containerName: string, prefix?: string): Promise<BlobItem[]> {
    // Note: This would require direct access to the storage account
    // In a production environment, you'd use Azure Storage SDK with proper authentication
    // For now, this is a placeholder that shows the structure
    console.warn('getBlobItems requires direct storage access - implement with Azure Storage SDK');
    return [];
  }

  async getQueues(storageAccountName: string, resourceGroup: string, subscriptionId: string): Promise<QueueItem[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Storage/storageAccounts/${storageAccountName}/queueServices/default/queues?api-version=2023-01-01`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch queues');
      }

      const data = await response.json();
      return data.value.map((queue: any) => ({
        name: queue.name,
        approximateMessageCount: queue.properties.approximateMessageCount || 0,
        metadata: queue.properties.metadata || {},
      }));
    } catch (error) {
      console.error('Error fetching queues:', error);
      throw error;
    }
  }

  async getQueueMessages(storageAccountName: string, queueName: string): Promise<QueueMessage[]> {
    // Note: This would require direct access to the storage account
    // In a production environment, you'd use Azure Storage SDK with proper authentication
    console.warn('getQueueMessages requires direct storage access - implement with Azure Storage SDK');
    return [];
  }

  async downloadBlob(storageAccountName: string, containerName: string, blobName: string): Promise<Blob> {
    // Note: This would require direct access to the storage account
    // In a production environment, you'd use Azure Storage SDK with proper authentication
    throw new Error('downloadBlob requires direct storage access - implement with Azure Storage SDK');
  }

  private applyFilters(accounts: StorageAccount[], filters: FilterOptions): StorageAccount[] {
    return accounts.filter(account => {
      if (filters.nameFilter && !account.name.toLowerCase().includes(filters.nameFilter.toLowerCase())) {
        return false;
      }
      
      if (filters.environment && account.tags.environment !== filters.environment) {
        return false;
      }
      
      if (filters.application && account.tags.application !== filters.application) {
        return false;
      }
      
      if (filters.resourceGroup && account.resourceGroup !== filters.resourceGroup) {
        return false;
      }
      
      return true;
    });
  }
}