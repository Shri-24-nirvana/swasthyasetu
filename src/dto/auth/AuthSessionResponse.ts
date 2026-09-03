import type { User } from "./User";

export interface AuthSessionResponse {
  token: string;
  user: User;
}
