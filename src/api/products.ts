import apiClient from './client';
import type { Product, CreateProductDto, UpdateProductDto } from '../types/product';

export async function getProducts(supplierId?: number): Promise<Product[]> {
  const response = await apiClient.get<Product[]>('/products', {
    params: supplierId ? { supplierId } : undefined,
  });
  return response.data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const response = await apiClient.post<Product>('/products', dto);
  return response.data;
}

export async function updateProduct(id: number, dto: UpdateProductDto): Promise<void> {
  await apiClient.put(`/products/${id}`, dto);
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}