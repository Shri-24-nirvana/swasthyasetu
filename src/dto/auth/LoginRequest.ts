import type { UserRole } from "@/dto/constants/UserRole";

export interface LoginRequest {
  identifier: string;
  role: UserRole;
}
