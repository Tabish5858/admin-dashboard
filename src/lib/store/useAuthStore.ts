import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string | null;
  name: string;
  username: string;
  balance?: number;
  isAdmin?: boolean;
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

          // Get additional user data from Firebase
          const userDoc = await getDoc(
            doc(db, "users", userCredential.user.uid)
          );
          const userData = userDoc.data();

          if (!userData) {
            throw new Error("User data not found in database");
          }

          const user = {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userData.fullName || email.split("@")[0],
            username: userData.username || email.split("@")[0],
            balance: userData.balance,
            isAdmin: userData.isAdmin || false,
          };

          set({
            user,
            isAuthenticated: true,
            error: null,
          });

          // This manual localStorage setting is redundant with zustand/persist
          // but keeping it for backward compatibility
          localStorage.setItem(
            "auth-storage",
            JSON.stringify({
              state: {
                user,
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
