import { Link } from "react-router-dom";
import { Menu, Moon, Sun, LogOut, HeartPulse, LayoutDashboard, Palette } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "@/context/themecontext";
import { useLanguage } from "@/components/utils/LanguageContext";
import { LanguageSwitch } from "@/components/shared/LanguageSwitch";
import { RealtimeStatusBadge } from "@/components/shared/RealtimeNotificationBanner";
import { UserRole } from "@/dto/constants/UserRole";

const roleKeyMap: Record<UserRole, string> = {
  [UserRole.PATIENT]: "role_patient",
  [UserRole.DOCTOR]: "role_doctor",
  [UserRole.HOSPITAL_STAFF]: "role_hospital_staff",
  [UserRole.LAB]: "role_lab",
  [UserRole.PHARMACY]: "role_pharmacy",
  [UserRole.HEALTHCARE_WORKER]: "role_healthcare_worker",
  [UserRole.ADMIN]: "role_admin",
  [UserRole.SECURITY]: "role_security",
  [UserRole.SUPER_ADMIN]: "role_super_admin",
};

export function Topbar({ onMenu, hasSidebar = true }: { onMenu: () => void; hasSidebar?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { isDark, toggleTheme, isOrange, toggleColorTheme } = useTheme();
  const { t } = useLanguage();

  const isPatient = user?.role === UserRole.PATIENT;
  const roleTranslationKey = user?.role ? roleKeyMap[user.role as UserRole] : "";
  const roleDisplay = roleTranslationKey ? t(roleTranslationKey) : user?.role || "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 sm:gap-3 border-b border-border bg-surface px-4 md:px-6 shadow-sm transition-colors">
      {hasSidebar && (
        <button
          onClick={onMenu}
          className="rounded-xl p-2 text-muted hover:bg-surface-hover hover:text-fg lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Brand logo when no sidebar is present */}
      {!hasSidebar && (
        <Link to="/patient" className="flex items-center gap-2.5 mr-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 dark:bg-brand-500 dark:text-slate-950 text-white shadow-sm transition group-hover:scale-105">
            <HeartPulse className="h-5 w-5" />
          </span>
          <div className="hidden sm:block">
            <span className="font-black text-sm tracking-tight text-fg">{t("app_name")}</span>
            <p className="text-[10px] text-muted -mt-0.5">{t("sub_tagline")}</p>
          </div>
        </Link>
      )}

      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-fg truncate">
          {t("welcome")}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-xs text-muted truncate">
          {roleDisplay} {t("portal")}
        </p>
      </div>

      <RealtimeStatusBadge />

      {isPatient && (
        <Link
          to="/patient"
          className="flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800 hover:bg-brand-100 transition shadow-xs"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-brand-700" />
          <span className="hidden md:inline">{t("dashboard")}</span>
        </Link>
      )}

      {/* Theme Color Palette Switcher (Ayushman Teal / Saffron Warm) */}
      <button
        onClick={toggleColorTheme}
        className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted hover:bg-surface-hover hover:text-fg transition shadow-2xs cursor-pointer"
        title={isOrange ? t("saffron") : t("teal")}
      >
        <Palette className="h-3.5 w-3.5 text-brand-600" />
        <span className="hidden lg:inline text-[11px] font-semibold">
          {isOrange ? t("saffron") : t("teal")}
        </span>
      </button>

      <LanguageSwitch />

      {/* Dark / Light Mode Switcher */}
      <button
        onClick={toggleTheme}
        className="rounded-xl border border-border p-2 text-muted hover:bg-surface-hover hover:text-fg transition shadow-2xs cursor-pointer"
        aria-label="Toggle theme"
        title={isDark ? t("switch_to_light") : t("switch_to_dark")}
      >
        {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
      </button>

      <button
        onClick={logout}
        className="rounded-xl border border-border p-2 text-muted hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-300 transition shadow-2xs cursor-pointer"
        aria-label="Logout"
        title={t("logout")}
      >
        <LogOut className="h-4 w-4" />
      </button>
    </header>
  );
}