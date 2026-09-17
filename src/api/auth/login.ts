import { UserRole } from "@/dto/constants/UserRole";
import type { AuthSessionResponse } from "@/dto/auth/AuthSessionResponse";
import type { User } from "@/dto/auth/User";
import { demoAccounts } from "@/lib/database/seedData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { delay } from "../utils/mock-delay";

export async function login(
  identifier: string,
  role?: UserRole,
  password?: string
): Promise<AuthSessionResponse> {
  const cleanId = (identifier || "").trim().toLowerCase();

  // 1. If Supabase is configured and an email/password was supplied
  if (isSupabaseConfigured()) {
    try {
      if (cleanId.includes("@") && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanId,
          password: password,
        });

        if (!error && data.user) {
          // Fetch user profile from Supabase
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();

          const user: User = {
            id: profile?.swasthya_id || data.user.id,
            name: profile?.name || data.user.user_metadata?.name || cleanId.split("@")[0],
            role: (profile?.role || data.user.user_metadata?.role || role || UserRole.PATIENT) as UserRole,
            facilityId: profile?.facility_id || data.user.user_metadata?.facility_id,
            email: data.user.email,
          };

          return {
            token: data.session?.access_token || `sb-${data.user.id}`,
            user,
          };
        }
      }

      // Check if user exists in profiles by swasthya_id, name, or phone
      const { data: profileMatch } = await supabase
        .from("profiles")
        .select("*")
        .or(`swasthya_id.ilike.%${cleanId}%,name.ilike.%${cleanId}%,phone.ilike.%${cleanId}%`)
        .limit(1)
        .maybeSingle();

      if (profileMatch) {
        const user: User = {
          id: profileMatch.swasthya_id || profileMatch.id,
          name: profileMatch.name,
          role: profileMatch.role as UserRole,
          facilityId: profileMatch.facility_id,
          email: profileMatch.email,
        };
        return {
          token: `sb-profile-${profileMatch.id}`,
          user,
        };
      }
    } catch (err) {
      console.warn("Supabase login lookup attempt:", err);
    }
  }

  // 2. Demo Account Matching
  await delay(150);

  if (cleanId) {
    const byUsername = demoAccounts.find((acc) => acc.username.toLowerCase() === cleanId);
    if (byUsername) {
      return { token: `mock-token-${byUsername.user.id}`, user: byUsername.user };
    }

    const byId = demoAccounts.find((acc) => acc.user.id.toLowerCase() === cleanId);
    if (byId) {
      return { token: `mock-token-${byId.user.id}`, user: byId.user };
    }

    const byName = demoAccounts.find((acc) => acc.user.name.toLowerCase().includes(cleanId));
    if (byName) {
      return { token: `mock-token-${byName.user.id}`, user: byName.user };
    }
  }

  if (role) {
    const byRole = demoAccounts.find((acc) => acc.role === role);
    if (byRole) {
      return { token: `mock-token-${byRole.user.id}`, user: byRole.user };
    }
  }

  const fallback = demoAccounts[0];
  return { token: `mock-token-${fallback.user.id}`, user: fallback.user };
}

export async function register(
  name: string,
  role: UserRole,
  email?: string,
  password?: string,
  details?: Record<string, any>
): Promise<AuthSessionResponse> {
  if (isSupabaseConfigured() && email && password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            ...details,
          },
        },
      });

      if (!error && data.user) {
        const swasthyaId = `SS-IND-${Date.now().toString().slice(-8)}`;
        await supabase.from("profiles").upsert({
          id: data.user.id,
          swasthya_id: swasthyaId,
          name,
          role,
          email,
          phone: details?.phone || null,
          village: details?.village || null,
          district: details?.district || "Rampur",
          facility_id: details?.facilityId || "phc-1",
        });

        const user: User = {
          id: swasthyaId,
          name,
          role,
          email,
          facilityId: details?.facilityId || "phc-1",
        };

        return {
          token: data.session?.access_token || `sb-${data.user.id}`,
          user,
        };
      }
    } catch (err) {
      console.warn("Supabase register error, falling back to local:", err);
    }
  }

  await delay(200);
  const user: User = { id: `u-${Date.now()}`, name, role, email };
  return { token: `mock-token-${user.id}`, user };
}
