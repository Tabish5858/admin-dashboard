// src/lib/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// src/lib/store/useAuthStore.ts
interface User {
  id: string;
  email: string | null;
  name?: string;
  isAdmin?: boolean; // Add this field
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
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
          const { user: firebaseUser } = userCredential;

          // Check if the user is admin (you can add more conditions)
          const isAdmin = email.toLowerCase().includes("admin");

          set({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || undefined,
              isAdmin,
            },
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isAuthenticated: false,
          });
          throw error;
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false, error: null });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Logout failed",
          });
          throw error;
        }
      },
      setError: (error) => set({ error }),
    }),
    {
      name: "auth-storage",
    }
  )
);

// Listen to auth state changes
onAuthStateChanged(auth, (user: FirebaseUser | null) => {
  if (user) {
    useAuthStore.getState().setError(null);
    useAuthStore.setState({
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName || undefined,
      },
      isAuthenticated: true,
    });
  } else {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  }
});
