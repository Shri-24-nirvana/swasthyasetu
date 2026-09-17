import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSessionResponse } from "@/dto/auth/AuthSessionResponse";
import type { User } from "@/dto/auth/User";
import { login as apiLogin, register as apiRegister } from "@/api/auth/login";
import { UserRole } from "@/dto/constants/UserRole";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (identifier: string, role?: UserRole, password?: string) => Promise<void>;
  loginUser: (user: User) => void;
  register: (name: string, role: UserRole, email?: string, password?: string, details?: Record<string, any>) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      async login(identifier, role, password) {
        const session: AuthSessionResponse = await apiLogin(identifier, role, password);
        set({ user: session.user, token: session.token });
      },
      loginUser(user) {
        set({ user, token: `token-${user.id}` });
      },
      async register(name, role, email, password, details) {
        const session: AuthSessionResponse = await apiRegister(name, role, email, password, details);
        set({ user: session.user, token: session.token });
      },
      logout() {
        if (isSupabaseConfigured()) {
          supabase.auth.signOut().catch(() => {});
        }
        set({ user: null, token: null });
      },
    }),
    { name: "swasthya-auth" }
  )
);
