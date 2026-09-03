import { UserRole } from "@/dto/constants/UserRole";
import type { AuthSession, User } from "@/dto/User";
import { delay } from "../utils/mock-delay";

const demoUsers: User[] = [
  { id: "u-patient", name: "Meera Sharma", role: UserRole.PATIENT },
  { id: "u-worker", name: "Dr. Anita Rao", role: UserRole.HEALTHCARE_WORKER, facilityId: "phc-1" },
  { id: "u-admin", name: "Aditya Malhotra", role: UserRole.ADMIN, facilityId: "dh-1" },
];

export interface LoginResult {
  session: AuthSession;
}

export async function login(_identifier: string, role: UserRole): Promise<AuthSession> {
  await delay(600);
  const user = demoUsers.find((u) => u.role === role) ?? demoUsers[0];
  return { token: `mock-token-${user.id}`, user };
}

export async function register(
  name: string,
  role: UserRole
): Promise<AuthSession> {
  await delay(600);
  const user: User = { id: `u-${Date.now()}`, name, role };
  return { token: `mock-token-${user.id}`, user };
}
