import type { UserRole } from "@/dto/constants/UserRole";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  facilityId?: string;
  email?: string;
}
