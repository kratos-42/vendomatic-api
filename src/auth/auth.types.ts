import { User } from '@auth/entities/auth.entity';

export interface AuthState {
  token: string;
  user: User;
}

export interface AuthContext {
  state: AuthState;
}
