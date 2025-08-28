import { create } from 'zustand';
import { AuthState, User, Role } from '../types';
import { authAPI } from '../lib/api';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string, roles: Role[]) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  roles: [],
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('authToken', response.token);
      set({
        user: response.user,
        token: response.token,
        roles: response.roles,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({
      user: null,
      token: null,
      roles: [],
      isAuthenticated: false,
    });
  },

  setUser: (user: User, token: string, roles: Role[]) => {
    localStorage.setItem('authToken', token);
    set({
      user,
      token,
      roles,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem('authToken');
    set({
      user: null,
      token: null,
      roles: [],
      isAuthenticated: false,
    });
  },
}));
