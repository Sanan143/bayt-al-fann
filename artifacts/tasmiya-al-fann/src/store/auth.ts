import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  name: string;
  email: string;
  password: string;
}

interface AuthStore {
  user: User | null;
  accounts: User[]; // all registered accounts
  signIn: (email: string, name: string, password?: string) => void;
  signUp: (email: string, name: string, password: string) => void;
  signOut: () => void;
  updateProfile: (email: string, name: string) => void;
  validateLogin: (email: string, password: string) => "ok" | "no_account" | "wrong_password";
  resetPassword: (email: string, newPassword: string) => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],

      signIn: (email, name, password = "") =>
        set({ user: { email, name, password } }),

      signUp: (email, name, password) => {
        const newUser: User = { email, name, password };
        set((state) => ({
          user: newUser,
          accounts: [
            ...state.accounts.filter((a) => a.email.toLowerCase() !== email.toLowerCase()),
            newUser,
          ],
        }));
      },

      signOut: () => set({ user: null }),

      updateProfile: (email, name) =>
        set((state) => {
          const updated = { ...state.user!, email, name };
          return {
            user: updated,
            accounts: state.accounts.map((a) =>
              a.email.toLowerCase() === (state.user?.email ?? "").toLowerCase()
                ? updated
                : a
            ),
          };
        }),

      validateLogin: (email, password) => {
        const { accounts } = get();
        const account = accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        );
        if (!account) return "no_account";
        if (account.password !== password) return "wrong_password";
        return "ok";
      },

      resetPassword: (email, newPassword) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.email.toLowerCase() === email.toLowerCase()
              ? { ...a, password: newPassword }
              : a
          ),
          user:
            state.user?.email.toLowerCase() === email.toLowerCase()
              ? { ...state.user, password: newPassword }
              : state.user,
        }));
      },
    }),
    { name: "bayt-al-fann-auth" }
  )
);
