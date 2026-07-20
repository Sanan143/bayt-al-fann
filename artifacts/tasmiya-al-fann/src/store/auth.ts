import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Password Hashing ────────────────────────────────────────────────────────
// Uses the browser's built-in Web Crypto API to hash passwords with SHA-256.
// While SHA-256 without a salt is not as strong as bcrypt, it is vastly better
// than storing passwords in plain text in localStorage.
// NOTE: For a production backend auth system, use bcrypt on the server.
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface User {
  name: string;
  email: string;
  passwordHash: string; // Never store raw passwords
}

interface AuthStore {
  user: User | null;
  accounts: User[]; // all registered accounts
  signIn: (email: string, name: string) => void;
  signUp: (email: string, name: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (email: string, name: string) => void;
  validateLogin: (email: string, password: string) => Promise<"ok" | "no_account" | "wrong_password">;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],

      // Sign in (called after validation succeeds)
      signIn: (email, name) =>
        set((state) => {
          const account = state.accounts.find(
            (a) => a.email.toLowerCase() === email.toLowerCase()
          );
          return { user: account ?? { email, name, passwordHash: "" } };
        }),

      // Sign up: hash the password before storing
      signUp: async (email, name, password) => {
        const passwordHash = await hashPassword(password);
        const newUser: User = { email, name, passwordHash };
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
          if (!state.user) return state;
          const updated = { ...state.user, email, name };
          return {
            user: updated,
            accounts: state.accounts.map((a) =>
              a.email.toLowerCase() === (state.user?.email ?? "").toLowerCase()
                ? updated
                : a
            ),
          };
        }),

      // Validate login: hash input and compare against stored hash
      validateLogin: async (email, password) => {
        const { accounts } = get();
        const account = accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        );
        if (!account) return "no_account";
        const inputHash = await hashPassword(password);
        if (account.passwordHash !== inputHash) return "wrong_password";
        return "ok";
      },

      // Reset password: hash the new password before storing
      resetPassword: async (email, newPassword) => {
        const newHash = await hashPassword(newPassword);
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.email.toLowerCase() === email.toLowerCase()
              ? { ...a, passwordHash: newHash }
              : a
          ),
          user:
            state.user?.email.toLowerCase() === email.toLowerCase()
              ? { ...state.user, passwordHash: newHash }
              : state.user,
        }));
      },
    }),
    { name: "bayt-al-fann-auth" }
  )
);

