import { Product, Category, TopProduct, ProductFilters } from "./types";

const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const TOKEN_KEY = "ml_token";

// ── server-side token cache ───────────────────────────────────────────────────
// Used only in Server Components; refreshed when expired.

let _serverToken: string | null = null;
let _serverTokenExpiry = 0;

async function getServerToken(): Promise<string | null> {
  if (_serverToken && Date.now() < _serverTokenExpiry) return _serverToken;
  const email = process.env.API_EMAIL;
  const password = process.env.API_PASSWORD;
  if (!email || !password) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    _serverToken = data.token as string;
    _serverTokenExpiry = Date.now() + 6 * 24 * 60 * 60 * 1000; // 6 days
    return _serverToken;
  } catch {
    return null;
  }
}

// ── auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  const data = await res.json();
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, data.token);
  return data.token;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

async function authHeaders(serverFallback = false): Promise<HeadersInit> {
  const clientToken = getToken();
  if (clientToken) return { Authorization: `Bearer ${clientToken}` };
  if (serverFallback) {
    const t = await getServerToken();
    if (t) return { Authorization: `Bearer ${t}` };
  }
  return {};
}

// ── products ─────────────────────────────────────────────────────────────────

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.search)   params.set("search", filters.search);
  if (filters.category) params.set("category", String(filters.category));
  if (filters.status)   params.set("status", filters.status);
  // Map our sort values to what the API accepts
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

  const headers = await authHeaders(true);
  const res = await fetch(`${BASE_URL}/api/products?${params}`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.products || data) as Product[];
}

export async function fetchProduct(id: number): Promise<Product | null> {
  const headers = await authHeaders(true);
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.product || data) as Product;
}

export async function fetchCategories(): Promise<Category[]> {
  const headers = await authHeaders(true);
  const res = await fetch(`${BASE_URL}/api/products/categories`, {
    headers,
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchTopProducts(): Promise<TopProduct[]> {
  const headers = await authHeaders(true);
  const res = await fetch(`${BASE_URL}/api/dashboard/top-products`, {
    headers,
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  return res.json();
}

// ── image url ────────────────────────────────────────────────────────────────

export function imageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-product.jpg";
  if (path.startsWith("http")) return path;
  // path already starts with "/" (e.g. "/uploads/file.jpg") — avoid double slash
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
