import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface User {
  id: string;
  email: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      login: async (email: string, password: string) => {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          set({
            user: {
              id: userCredential.user.uid,
              email: userCredential.user.email,
            },
            isAuthenticated: true,
            error: null,
          });
          localStorage.setItem(
            "auth-storage",
            JSON.stringify({
              state: {
                user: {
                  id: userCredential.user.uid,
                  email: userCredential.user.email,
                },
                isAuthenticated: true,
              },
            })
          );
        } catch (error) {
          console.error("Login error:", error);
          set({
            user: null,
            isAuthenticated: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
          throw error;
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          set({ error: "Logout failed" });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
