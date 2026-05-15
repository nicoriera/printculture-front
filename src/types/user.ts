/** Authenticated user as returned by GET /api/auth/me (no password). */
export interface IUser {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

/** Value exposed by `useAuth()` throughout the app. */
export interface AuthContextType {
  /** Currently authenticated user, or `null` when logged out. */
  user: IUser | null;
  /** Authenticates and redirects to /recommendations on success. */
  login: (email: string, password: string) => Promise<void>;
  /** Registers and redirects to /recommendations on success. */
  register: (email: string, password: string) => Promise<void>;
  /** Clears the auth cookie and redirects to /. */
  logout: () => void;
  /** `true` while the initial auth check or a login/register call is in flight. */
  isLoading: boolean;
}
