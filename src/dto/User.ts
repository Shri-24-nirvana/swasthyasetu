import type { UserRole } from "./constants/UserRole";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  facilityId?: string;
  email?: string;
}

export interface AuthSession {
  token: string;
  user: User;
}
