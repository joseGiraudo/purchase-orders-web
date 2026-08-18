// src/api/purchaseOrders.ts
import apiClient from './client';
import type {
  PurchaseOrder,
  CreatePurchaseOrderDto,
  ChangeOrderStatusDto,
} from '../types/purchaseOrder';

export async function getPurchaseOrders(currentUserId: number): Promise<PurchaseOrder[]> {
  const response = await apiClient.get<PurchaseOrder[]>('/purchaseorders', {
    params: { currentUserId },
  });
  return response.data;
}

export async function getPurchaseOrderById(id: number): Promise<PurchaseOrder> {
  const response = await apiClient.get<PurchaseOrder>(`/purchaseorders/${id}`);
  return response.data;
}

export async function createPurchaseOrder(
  dto: CreatePurchaseOrderDto
): Promise<PurchaseOrder> {
  const response = await apiClient.post<PurchaseOrder>('/purchaseorders', dto);
  return response.data;
}

export async function changeOrderStatus(
  id: number,
  dto: ChangeOrderStatusDto
): Promise<PurchaseOrder> {
  const response = await apiClient.patch<PurchaseOrder>(
    `/purchaseorders/${id}/status`,
    dto
  );
  return response.data;
}