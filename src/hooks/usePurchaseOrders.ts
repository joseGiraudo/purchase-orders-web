// src/hooks/usePurchaseOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  changeOrderStatus,
} from '../api/purchaseOrders';
import type {
  CreatePurchaseOrderDto,
  ChangeOrderStatusDto,
} from '../types/purchaseOrder';

export function usePurchaseOrders() {
  return useQuery({
    queryKey: ['purchase-orders'],
    queryFn: getPurchaseOrders,
  });
}

export function usePurchaseOrder(id: number) {
  return useQuery({
    queryKey: ['purchase-orders', id],
    queryFn: () => getPurchaseOrderById(id),
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePurchaseOrderDto) => createPurchaseOrder(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

export function useChangeOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ChangeOrderStatusDto }) =>
      changeOrderStatus(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}