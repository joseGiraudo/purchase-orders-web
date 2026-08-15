export interface Product {
  id: number;
  supplierId: number;
  supplierName: string;
  name: string;
  description?: string;
  sku?: string;
  referencePrice: number;
  isActive: boolean;
}

export interface CreateProductDto {
  supplierId: number;
  name: string;
  description?: string;
  sku?: string;
  referencePrice: number;
}

export interface UpdateProductDto {
  name: string;
  description?: string;
  sku?: string;
  referencePrice: number;
}