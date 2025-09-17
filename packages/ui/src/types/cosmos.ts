export interface CosmosAccount {
  id: string;
  name: string;
  resourceGroup: string;
  location: string;
  tags: Record<string, string>;
  documentEndpoint: string;
  kind: string;
}

export interface CosmosDatabase {
  id: string;
  selfLink: string;
  etag: string;
  timestamp: Date;
}

export interface CosmosCollection {
  id: string;
  selfLink: string;
  etag: string;
  timestamp: Date;
  indexingPolicy: any;
  partitionKey: any;
}

export interface MongoQueryResult {
  documents: any[];
  requestCharge: number;
  executionTime: number;
}

export interface MongoShellCommand {
  command: string;
  database: string;
  collection: string;
  result?: MongoQueryResult;
  error?: string;
  timestamp: Date;
}