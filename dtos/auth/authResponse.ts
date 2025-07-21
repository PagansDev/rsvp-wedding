export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: any | null;
  error?: string;
}
