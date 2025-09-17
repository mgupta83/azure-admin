import { create } from 'zustand';
import { StorageAccount, BlobContainer, QueueItem } from '@/types';

interface StorageState {
  // Data
  accounts: StorageAccount[];
  containers: BlobContainer[];
  queues: QueueItem[];
  
  // UI State
  selectedAccount: StorageAccount | null;
  selectedContainer: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAccounts: (accounts: StorageAccount[]) => void;
  setContainers: (containers: BlobContainer[]) => void;
  setQueues: (queues: QueueItem[]) => void;
  setSelectedAccount: (account: StorageAccount | null) => void;
  setSelectedContainer: (container: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  accounts: [],
  containers: [],
  queues: [],
  selectedAccount: null,
  selectedContainer: null,
  isLoading: false,
  error: null,
};

export const useStorageStore = create<StorageState>((set) => ({
  ...initialState,

  setAccounts: (accounts) => set({ accounts }),
  setContainers: (containers) => set({ containers }),
  setQueues: (queues) => set({ queues }),
  setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
  setSelectedContainer: (selectedContainer) => set({ selectedContainer }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));