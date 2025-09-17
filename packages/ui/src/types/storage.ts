export interface StorageAccount {
  id: string;
  name: string;
  resourceGroup: string;
  location: string;
  tags: Record<string, string>;
  primaryEndpoints: {
    blob?: string;
    queue?: string;
  };
}

export interface BlobContainer {
  name: string;
  lastModified: Date;
  publicAccess: string;
  metadata: Record<string, string>;
}

export interface BlobItem {
  name: string;
  lastModified: Date;
  size: number;
  contentType: string;
  etag: string;
  isFolder: boolean;
  metadata: Record<string, string>;
}

export interface QueueItem {
  name: string;
  approximateMessageCount: number;
  metadata: Record<string, string>;
}

export interface QueueMessage {
  messageId: string;
  messageText: string;
  insertionTime: Date;
  expirationTime: Date;
  dequeueCount: number;
}