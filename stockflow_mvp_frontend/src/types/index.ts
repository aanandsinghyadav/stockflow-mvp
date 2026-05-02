// ─── API wrapper ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  email: string;
  organizationName: string;
}

export interface AuthUser {
  email: string;
  organizationName: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  description?: string;
  quantity: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface LowStockItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
}

export interface DashboardData {
  totalProducts: number;
  totalQuantity: number;
  lowStockItems: LowStockItem[];
}

// ─── Settings ────────────────────────────────────────────────────────────────
export interface Settings {
  organizationId: number;
  organizationName: string;
  defaultLowStockThreshold: number;
}
