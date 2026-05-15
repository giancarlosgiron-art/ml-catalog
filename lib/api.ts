import { Product, Category, TopProduct, ProductFilters } from "./types";

// En desarrollo: NEXT_PUBLIC_API_URL=http://localhost:3001 en .env.local
// En producción: si no está la variable, usa el backend de Railway como fallback seguro
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://by-maria-lugo-production.up.railway.app";
const TOKEN_KEY = "ml_token";
const TOKEN_EXPIRY_KEY = "ml_token_expiry";

const isClient = typeof window !== "undefined";

// ── client-side auto-login ────────────────────────────────────────────────────
// Uses NEXT_PUBLIC_API_EMAIL / NEXT_PUBLIC_API_PASSWORD (visible in browser).
// Token cached in localStorage with 6-day expiry.

async function getClientToken(): Promise<string | null> {
  // Return cached token if still valid
  if (isClient) {
    const cached = localStorage.getItem(TOKEN_KEY);
    const expiry = Number(localStorage.getItem(TOKEN_EXPIRY_KEY) || 0);
    if (cached && Date.now() < expiry) return cached;
  }

  const email = process.env.NEXT_PUBLIC_API_EMAIL;
  const password = process.env.NEXT_PUBLIC_API_PASSWORD;
  if (!email || !password) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const token = data.token as string;
    if (isClient) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + 6 * 24 * 60 * 60 * 1000));
    }
    return token;
  } catch {
    return null;
  }
}

// ── auth (manual login) ───────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  const data = await res.json();
  if (isClient) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + 6 * 24 * 60 * 60 * 1000));
  }
  return data.token;
}

export function getToken(): string | null {
  if (!isClient) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  if (isClient) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }
}

// ── products ──────────────────────────────────────────────────────────────────
// Client: fetch directly to BASE_URL using auto-login token.
// Server (product detail page): fetch directly using server-only serverToken.

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

  const token = isClient
    ? await getClientToken()
    : await (await import("./serverToken")).getServerToken();

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
  // Always called from Server Component (product detail page)
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
  const token = isClient
    ? await getClientToken()
    : await (await import("./serverToken")).getServerToken();

  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/products/categories`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchTopProducts(): Promise<TopProduct[]> {
  const token = isClient
    ? await getClientToken()
    : await (await import("./serverToken")).getServerToken();

  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/dashboard/top-products`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

// ── image url ─────────────────────────────────────────────────────────────────

export function imageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-product.jpg";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
