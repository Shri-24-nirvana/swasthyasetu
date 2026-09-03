import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "@/components/utils/ThemeContext";
import { useLanguage } from "@/components/utils/LanguageContext";
import { LanguageSwitch } from "@/components/shared/LanguageSwitch";
import { UserRole } from "@/dto/constants/UserRole";

const roleLabels: Record<UserRole, string> = {
  [UserRole.PATIENT]: "Citizen",
  [UserRole.HEALTHCARE_WORKER]: "Healthcare Worker",
  [UserRole.ADMIN]: "Administrator",
};

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface px-4">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-muted hover:bg-brand-50 hover:text-fg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1">
        <h1 className="text-sm font-semibold text-fg">
          {t("welcome")}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-xs text-muted">
          {user?.role ? roleLabels[user.role as UserRole] : ""} Portal
        </p>
      </div>

      <LanguageSwitch />

      <button
        onClick={toggleTheme}
        className="rounded-md p-2 text-muted hover:bg-brand-50 hover:text-fg"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>

      <button
        onClick={logout}
        className="rounded-md p-2 text-muted hover:bg-brand-50 hover:text-danger"
        aria-label="Logout"
        title={t("logout")}
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  );
}