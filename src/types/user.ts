export type UserRole = 'Employee' | 'Supervisor' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  supervisorId?: number;
  supervisorName?: string;
  isActive: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  supervisorId?: number;
}

export interface UpdateUserDto {
  name: string;
  role: UserRole;
  supervisorId?: number;
}