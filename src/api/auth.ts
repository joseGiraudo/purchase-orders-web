import type { AuthResponse, LoginDto } from "../types/auth";
import apiClient from "./client";


export async function login(dto: LoginDto): Promise<AuthResponse> {

    const response = await apiClient.post<AuthResponse>('/auth/login', dto);
    return response.data
}