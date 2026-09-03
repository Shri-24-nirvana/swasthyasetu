import type { UserRole } from "@/dto/constants/UserRole";

export interface RegisterRequest {
  name: string;
  role: UserRole;
}
