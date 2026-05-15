import { Product, Category, TopProduct, ProductFilters } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const TOKEN_KEY = "ml_token";

const isClient = typeof window !== "undefined";

// ── auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  const data = await res.json();
  if (isClient) localStorage.setItem(TOKEN_KEY, data.token);
  return data.token;
}

export function getToken(): string | null {
  if (!isClient) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  if (isClient) localStorage.removeItem(TOKEN_KEY);
}

// ── products ─────────────────────────────────────────────────────────────────
// On the client → calls /api/products (Next.js proxy route, server handles auth)
// On the server → calls backend directly via lib/serverToken (Server Components)

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.search)   params.set("search", filters.search);
  if (filters.category) params.set("category", String(filters.category));
  if (filters.status)   params.set("status", filters.status);

  const sortMap: Record<string, string> = {
    newest:    "created",
    price_asc: "price",
    price_desc:"price",
    name:      "name",
    bestseller:"name",
  };
  const orderMap: Record<string, string> = {
    price_desc: "DESC",
    newest:     "DESC",
  };
  if (filters.sort) {
    params.set("sort", sortMap[filters.sort] || "name");
    const order = orderMap[filters.sort];
    if (order) params.set("order", order);
  }

  if (isClient) {
    // Browser → use Next.js proxy route (auth handled server-side)
    const res = await fetch(`/api/products?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products || data) as Product[];
  }

  // Server Component → call backend directly with server token
  const { getServerToken } = await import("./serverToken");
  const token = await getServerToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/products?${params}`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.products || data) as Product[];
}

export async function fetchProduct(id: number): Promise<Product | null> {
  // Product detail page stays as Server Component — direct backend call
  const { getServerToken } = await import("./serverToken");
  const token = await getServerToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.product || data) as Product;
}

export async function fetchCategories(): Promise<Category[]> {
  if (isClient) {
    const res = await fetch(`/api/categories`);
    if (!res.ok) return [];
    return res.json();
  }

  const { getServerToken } = await import("./serverToken");
  const token = await getServerToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/products/categories`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchTopProducts(): Promise<TopProduct[]> {
  if (isClient) {
    const res = await fetch(`/api/top-products`);
    if (!res.ok) return [];
    return res.json();
  }

  const { getServerToken } = await import("./serverToken");
  const token = await getServerToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/dashboard/top-products`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

// ── image url ────────────────────────────────────────────────────────────────

export function imageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-product.jpg";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
