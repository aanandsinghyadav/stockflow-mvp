export class LowStockItemDto {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number; // resolved value (product's own or org default)
}

export class DashboardResponseDto {
  totalProducts: number;
  totalQuantity: number;   // sum of quantity across all products
  lowStockItems: LowStockItemDto[];
}
