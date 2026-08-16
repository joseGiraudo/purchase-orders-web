import type { CreateUserDto, UpdateUserDto, User } from "../types/user";
import apiClient from "./client";


export async function getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
}

export async function getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
}

export async function createUser(user: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>('users', user);
    return response.data;
}

export async function updateUser(id: number, dto: UpdateUserDto): Promise<void> {
  await apiClient.put(`/users/${id}`, dto);
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}