export type OrderStatus = 'Created' | 'Approved' | 'Rejected' | 'Sent' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: number;
  number: string;
  employeeId: number;
  employeeName: string;
  supplierId: number;
  supplierName: string;
  status: OrderStatus;
  createdAt: string; // ISO date string
  totalAmount: number;
  rejectionReason?: string;
  items: OrderItem[];
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreatePurchaseOrderDto {
  employeeId: number;
  supplierId: number;
  items: CreateOrderItemDto[];
}

export interface ChangeOrderStatusDto {
  newStatus: OrderStatus;
  changedByUserId: number;
  comment?: string;
}