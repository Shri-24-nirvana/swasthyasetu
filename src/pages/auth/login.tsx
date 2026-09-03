import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LanguageSwitch } from "@/components/shared/LanguageSwitch";
import { useLanguage } from "@/components/utils/LanguageContext";
import { UserRole } from "@/dto/constants/UserRole";

const roleHome: Record<UserRole, string> = {
  [UserRole.PATIENT]: "/patient",
  [UserRole.HEALTHCARE_WORKER]: "/worker",
  [UserRole.ADMIN]: "/admin",
};

const roleExamples: Record<UserRole, string> = {
  [UserRole.PATIENT]: "Try: meera or 8421 9938 0012",
  [UserRole.HEALTHCARE_WORKER]: "Try: anita or 8421 9938 0021",
  [UserRole.ADMIN]: "Try: aditya or 8421 9938 0082",
};

const authCode: Record<UserRole, string> = {
  [UserRole.PATIENT]: "8421 9938 0012",
  [UserRole.HEALTHCARE_WORKER]: "8421 9938 0021",
  [UserRole.ADMIN]: "8421 9938 0082",
};

export function LoginPage() {
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(identifier || authCode[role], role);
      navigate(roleHome[role]);
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white">
            <HeartPulse className="h-7 w-7" />
          </span>
          <h1 className="text-xl font-bold text-fg">{t("app_name")}</h1>
          <p className="text-sm text-muted">{t("tagline")}</p>
          <div className="mt-3">
            <LanguageSwitch />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-fg">
              Portal Role
            </label>
            <Select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as UserRole);
                setIdentifier("");
              }}
            >
              <option value={UserRole.PATIENT}>Citizen / Patient</option>
              <option value={UserRole.HEALTHCARE_WORKER}>Healthcare Worker</option>
              <option value={UserRole.ADMIN}>Hospital / Govt Admin</option>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-fg">
              Swasthya ID or Phone
            </label>
            <Input
              placeholder={roleExamples[role]}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted">Demo {roleExamples[role]}</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : t("login")}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/register")}>
            {t("register")}
          </Button>
        </form>
      </Card>
    </div>
  );
}