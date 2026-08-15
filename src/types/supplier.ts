export interface Supplier {
  id: number;
  name: string;
  taxId: string;
  contactName: string;
  email: string;
  isActive: boolean;
}

export interface CreateSupplierDto {
  name: string;
  taxId: string;
  contactName: string;
  email: string;
}

export interface UpdateSupplierDto {
  name: string;
  taxId: string;
  contactName: string;
  email: string;
}