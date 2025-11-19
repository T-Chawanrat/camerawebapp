// store/Auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserType {
  user_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  license_plate?: string;
  warehouses?: unknown[];
}

interface AuthStore {
  user: UserType | null;
  isLoggedIn: boolean;
  setUser: (user: UserType | null) => void;
  setIsLoggedIn: (val: boolean) => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (userData) => set({ user: userData }),
      setIsLoggedIn: (val) => set({ isLoggedIn: val }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);



