import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  signIn: (email: string, name: string) => void;
  signUp: (email: string, name: string) => void;
  signOut: () => void;
  updateProfile: (email: string, name: string) => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email, name) => set({ user: { email, name } }),
      signUp: (email, name) => set({ user: { email, name } }),
      signOut: () => set({ user: null }),
      updateProfile: (email, name) => set({ user: { email, name } }),
    }),
    { name: "bayt-al-fann-auth" }
  )
);
