import { create } from 'zustand';
import { User, Role } from '../types';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin' || user?.role === 'Super Admin',
    isStaff: user?.role === 'Kitchen Staff' || user?.role === 'Sales Staff' || user?.role === 'Delivery Staff' || user?.role === 'Manager' || user?.role === 'Admin' || user?.role === 'Super Admin'
  }),
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
    set({ user: null, isAuthenticated: false, isAdmin: false, isStaff: false });
  },
}));
