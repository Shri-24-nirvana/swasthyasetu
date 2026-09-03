import { createContext, useContext, type ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/dto/constants/UserRole";

interface AuthContextValue {
  userRole: UserRole | null;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);

  const hasRole = (...roles: UserRole[]) =>
    !!user?.role && roles.includes(user.role);

  const value: AuthContextValue = {
    userRole: user?.role ?? null,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}