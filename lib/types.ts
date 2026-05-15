export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export type StockStatus = "available" | "low_stock" | "out_of_stock";

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  category_id: number;
  category_name?: string;
  cost_price: number;
  sale_price: number;
  stock: number;
  min_stock: number;
  status: StockStatus;
  image: string | null;
  created_at: string;
  // computed
  is_new?: boolean;
  is_bestseller?: boolean;
  country?: "chile" | "venezuela" | "both";
}

export interface ProductFilters {
  search?: string;
  category?: number | "";
  status?: StockStatus | "";
  sort?: "name" | "price_asc" | "price_desc" | "newest" | "bestseller";
  country?: "chile" | "venezuela" | "both" | "";
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface TopProduct {
  id: number;
  name: string;
  image: string | null;
  revenue: number;
  quantity: number;
  sku: string;
  sale_price: number;
  category_name: string;
}
