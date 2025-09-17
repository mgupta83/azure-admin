export interface FunctionApp {
  id: string;
  name: string;
  resourceGroup: string;
  location: string;
  tags: Record<string, string>;
  defaultHostName: string;
  state: 'Running' | 'Stopped' | 'Error';
  kind: string;
  runtime: string;
}

export interface FunctionAppSetting {
  name: string;
  value: string;
  isSecret: boolean;
}

export interface AzureFunction {
  name: string;
  status: 'Enabled' | 'Disabled';
  triggerType: string;
  lastModified: Date;
  href: string;
}

export interface FunctionExecutionStatus {
  id: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Cancelled';
  createdTime: Date;
  lastUpdatedTime: Date;
  input: any;
  output: any;
  error?: string;
}