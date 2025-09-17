import { CosmosAccount, CosmosDatabase, CosmosCollection, MongoQueryResult, FilterOptions } from '@/types';
import { AuthService } from './auth.service';
import { azureEndpoints } from './auth.config';

export class CosmosService {
  private authService = AuthService.getInstance();

  async getCosmosAccounts(subscriptionId: string, filters?: FilterOptions): Promise<CosmosAccount[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/providers/Microsoft.DocumentDB/databaseAccounts?api-version=2023-04-15`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Cosmos DB accounts');
      }

      const data = await response.json();
      let accounts: CosmosAccount[] = data.value
        .filter((account: any) => account.kind === 'MongoDB') // Only MongoDB API accounts
        .map((account: any) => ({
          id: account.id,
          name: account.name,
          resourceGroup: account.id.split('/')[4],
          location: account.location,
          tags: account.tags || {},
          documentEndpoint: account.properties.documentEndpoint,
          kind: account.kind,
        }));

      // Apply filters
      if (filters) {
        accounts = this.applyFilters(accounts, filters);
      }

      return accounts;
    } catch (error) {
      console.error('Error fetching Cosmos DB accounts:', error);
      throw error;
    }
  }

  async getDatabases(accountName: string, resourceGroup: string, subscriptionId: string): Promise<CosmosDatabase[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.DocumentDB/databaseAccounts/${accountName}/mongodbDatabases?api-version=2023-04-15`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch databases');
      }

      const data = await response.json();
      return data.value.map((db: any) => ({
        id: db.properties.resource.id,
        selfLink: db.properties.resource._self || '',
        etag: db.properties.resource._etag || '',
        timestamp: new Date(db.properties.resource._ts * 1000),
      }));
    } catch (error) {
      console.error('Error fetching databases:', error);
      throw error;
    }
  }

  async getCollections(accountName: string, databaseName: string, resourceGroup: string, subscriptionId: string): Promise<CosmosCollection[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.DocumentDB/databaseAccounts/${accountName}/mongodbDatabases/${databaseName}/collections?api-version=2023-04-15`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = await response.json();
      return data.value.map((collection: any) => ({
        id: collection.properties.resource.id,
        selfLink: collection.properties.resource._self || '',
        etag: collection.properties.resource._etag || '',
        timestamp: new Date(collection.properties.resource._ts * 1000),
        indexingPolicy: collection.properties.resource.indexingPolicy,
        partitionKey: collection.properties.resource.partitionKey,
      }));
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }

  async executeMongoQuery(
    accountName: string, 
    databaseName: string, 
    collectionName: string, 
    query: string
  ): Promise<MongoQueryResult> {
    // Note: This would require direct access to the Cosmos DB account
    // In a production environment, you'd use Azure Cosmos DB SDK with proper authentication
    // and ensure the query is read-only (find/aggregate operations only)
    
    // Parse and validate the query to ensure it's read-only
    const normalizedQuery = query.trim().toLowerCase();
    if (!this.isReadOnlyQuery(normalizedQuery)) {
      throw new Error('Only read-only operations (find, aggregate) are allowed');
    }

    // This is a placeholder - actual implementation would use Cosmos DB SDK
    console.warn('executeMongoQuery requires direct Cosmos DB access - implement with Azure Cosmos DB SDK');
    
    return {
      documents: [],
      requestCharge: 0,
      executionTime: 0,
    };
  }

  private isReadOnlyQuery(query: string): boolean {
    const readOnlyOperations = ['find', 'findone', 'aggregate', 'count', 'distinct', 'explain'];
    const writeOperations = ['insert', 'update', 'delete', 'remove', 'drop', 'create', 'save', 'replaceone', 'updateone', 'updateMany', 'deleteone', 'deletemany'];
    
    // Check if query starts with read-only operations
    const startsWithReadOnly = readOnlyOperations.some(op => 
      query.startsWith(`db.`) && query.includes(`.${op}(`)
    );
    
    // Check if query contains any write operations
    const containsWriteOps = writeOperations.some(op => 
      query.includes(`.${op}(`)
    );
    
    return startsWithReadOnly && !containsWriteOps;
  }

  private applyFilters(accounts: CosmosAccount[], filters: FilterOptions): CosmosAccount[] {
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