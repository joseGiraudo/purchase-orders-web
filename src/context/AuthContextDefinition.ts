import { createContext } from 'react';
import type { User } from '../types/user';
import type { LoginDto } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);