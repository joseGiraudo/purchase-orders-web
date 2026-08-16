import type { CreateSupplierDto, Supplier, UpdateSupplierDto } from "../types/supplier";
import apiClient from "./client";


export async function getSuppliers(): Promise<Supplier[]> {
    const response = await apiClient.get<Supplier[]>('/suppliers');
    return response.data;
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
  return response.data;
}

export async function createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
  const response = await apiClient.post<Supplier>('/suppliers', dto);
  return response.data;
}

export async function updateSupplier(id: number, dto: UpdateSupplierDto): Promise<void> {
  await apiClient.put(`/suppliers/${id}`, dto);
}

export async function deleteSupplier(id: number): Promise<void> {
  await apiClient.delete(`/suppliers/${id}`);
}