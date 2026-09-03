import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card, CardTitle } from "@/components/ui/Card";
import { UserRole } from "@/dto/constants/UserRole";

const roleHome: Record<UserRole, string> = {
  [UserRole.PATIENT]: "/patient",
  [UserRole.HEALTHCARE_WORKER]: "/worker",
  [UserRole.ADMIN]: "/admin",
};

export function RegisterPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name || "New User", role);
      navigate(roleHome[role]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 p-4">
      <Card className="w-full max-w-md">
        <CardTitle className="mb-4">Create your account</CardTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-fg">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-fg">Portal Role</label>
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value={UserRole.PATIENT}>Citizen / Patient</option>
              <option value={UserRole.HEALTHCARE_WORKER}>Healthcare Worker</option>
              <option value={UserRole.ADMIN}>Hospital / Govt Admin</option>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </form>
      </Card>
    </div>
  );
}