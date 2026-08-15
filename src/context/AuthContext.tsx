import { useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/user';
import type { LoginDto } from '../types/auth';
import { login as loginRequest } from '../api/auth';
import { AuthContext } from './AuthContextDefinition';


function getStoredUser(): User | null {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');

  if (storedUser && storedToken) {
    return JSON.parse(storedUser);
  }

  return null;
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);

  async function login(dto: LoginDto) {
    const response = await loginRequest(dto);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}