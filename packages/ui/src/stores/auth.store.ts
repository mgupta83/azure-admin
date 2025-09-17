import { create } from 'zustand';
import { User as OidcUser } from 'oidc-client-ts';
import { User, UserPreferences, AzureSubscription } from '@/types';

interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  oidcUser: OidcUser | null;
  user: User | null;
  error: string | null;

  // User preferences and context
  preferences: UserPreferences | null;
  subscriptions: AzureSubscription[];
  currentSubscription: string | null;
  currentDirectory: string | null;

  // Actions
  setOidcUser: (user: OidcUser | null) => void;
  setUser: (user: User | null) => void;
  setPreferences: (preferences: UserPreferences) => void;
  setSubscriptions: (subscriptions: AzureSubscription[]) => void;
  setCurrentSubscription: (subscriptionId: string) => void;
  setCurrentDirectory: (directoryId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  oidcUser: null,
  user: null,
  error: null,
  preferences: null,
  subscriptions: [],
  currentSubscription: null,
  currentDirectory: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  setOidcUser: (oidcUser) => {
    set({ 
      oidcUser, 
      isAuthenticated: !!oidcUser,
      error: null 
    });
  },

  setUser: (user) => {
    set({ user });
  },

  setPreferences: (preferences) => {
    set({ preferences });
  },

  setSubscriptions: (subscriptions) => {
    set({ subscriptions });
    
    // Auto-select first subscription if none selected
    const current = get();
    if (!current.currentSubscription && subscriptions.length > 0) {
      set({ currentSubscription: subscriptions[0]?.subscriptionId });
    }
  },

  setCurrentSubscription: (subscriptionId) => {
    set({ currentSubscription: subscriptionId });
  },

  setCurrentDirectory: (directoryId) => {
    set({ currentDirectory: directoryId });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },
}));