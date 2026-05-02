export class ProductResponseDto {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  quantity: number;
  costPrice: number | null;
  sellingPrice: number | null;
  lowStockThreshold: number | null;
  isLowStock: boolean;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
}
