export * from './auth';
export * from './storage';
export * from './cosmos';
export * from './functions';
export * from './keyvault';

export interface FilterOptions {
  environment?: string; // 3-char value like 'dev', 'prd'
  application?: string; // 3-char code like 'abc', 'xyz'
  nameFilter?: string;
  resourceGroup?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export type ResourceType = 'storage' | 'cosmos' | 'function' | 'keyvault';

export interface NavigationItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: NavigationItem[];
}