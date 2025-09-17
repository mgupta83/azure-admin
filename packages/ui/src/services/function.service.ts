import { FunctionApp, FunctionAppSetting, AzureFunction, FilterOptions } from '@/types';
import { AuthService } from './auth.service';
import { azureEndpoints } from './auth.config';

export class FunctionService {
  private authService = AuthService.getInstance();

  async getFunctionApps(subscriptionId: string, filters?: FilterOptions): Promise<FunctionApp[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/providers/Microsoft.Web/sites?api-version=2022-03-01`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch function apps');
      }

      const data = await response.json();
      let functionApps: FunctionApp[] = data.value
        .filter((site: any) => site.kind?.includes('functionapp'))
        .map((app: any) => ({
          id: app.id,
          name: app.name,
          resourceGroup: app.id.split('/')[4],
          location: app.location,
          tags: app.tags || {},
          defaultHostName: app.properties.defaultHostName,
          state: app.properties.state,
          kind: app.kind,
          runtime: app.properties.siteConfig?.linuxFxVersion || app.properties.siteConfig?.windowsFxVersion || 'Unknown',
        }));

      // Apply filters
      if (filters) {
        functionApps = this.applyFilters(functionApps, filters);
      }

      return functionApps;
    } catch (error) {
      console.error('Error fetching function apps:', error);
      throw error;
    }
  }

  async getFunctionAppSettings(
    functionAppName: string, 
    resourceGroup: string, 
    subscriptionId: string,
    nameFilter?: string
  ): Promise<FunctionAppSetting[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Web/sites/${functionAppName}/config/appsettings/list?api-version=2022-03-01`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch function app settings');
      }

      const data = await response.json();
      let settings: FunctionAppSetting[] = Object.entries(data.properties).map(([name, value]) => ({
        name,
        value: value as string,
        isSecret: this.isSecretSetting(name),
      }));

      // Apply name filter
      if (nameFilter) {
        settings = settings.filter(setting => 
          setting.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      return settings;
    } catch (error) {
      console.error('Error fetching function app settings:', error);
      throw error;
    }
  }

  async getFunctions(
    functionAppName: string, 
    resourceGroup: string, 
    subscriptionId: string
  ): Promise<AzureFunction[]> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Web/sites/${functionAppName}/functions?api-version=2022-03-01`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch functions');
      }

      const data = await response.json();
      return data.value.map((func: any) => ({
        name: func.name,
        status: func.properties.config?.disabled === true ? 'Disabled' : 'Enabled',
        triggerType: this.extractTriggerType(func.properties.config),
        lastModified: new Date(func.properties.modified),
        href: func.properties.href,
      }));
    } catch (error) {
      console.error('Error fetching functions:', error);
      throw error;
    }
  }

  async getFunctionStatus(
    functionAppName: string, 
    functionName: string, 
    resourceGroup: string, 
    subscriptionId: string
  ): Promise<any> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('No access token available');

    try {
      const url = `${azureEndpoints.management}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Web/sites/${functionAppName}/functions/${functionName}?api-version=2022-03-01`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch function status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching function status:', error);
      throw error;
    }
  }

  private isSecretSetting(settingName: string): boolean {
    const secretPatterns = [
      'key', 'secret', 'password', 'token', 'connectionstring', 
      'connstring', 'connection_string', 'apikey', 'api_key'
    ];
    
    const lowerName = settingName.toLowerCase();
    return secretPatterns.some(pattern => lowerName.includes(pattern));
  }

  private extractTriggerType(config: any): string {
    if (!config || !config.bindings) return 'Unknown';
    
    const triggerBinding = config.bindings.find((binding: any) => 
      binding.direction === 'in' && binding.type?.endsWith('Trigger')
    );
    
    return triggerBinding?.type || 'Unknown';
  }

  private applyFilters(functionApps: FunctionApp[], filters: FilterOptions): FunctionApp[] {
    return functionApps.filter(app => {
      if (filters.nameFilter && !app.name.toLowerCase().includes(filters.nameFilter.toLowerCase())) {
        return false;
      }
      
      if (filters.environment && app.tags.environment !== filters.environment) {
        return false;
      }
      
      if (filters.application && app.tags.application !== filters.application) {
        return false;
      }
      
      if (filters.resourceGroup && app.resourceGroup !== filters.resourceGroup) {
        return false;
      }
      
      return true;
    });
  }
}