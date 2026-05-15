import { NextResponse } from "next/server";
import { getServerToken } from "@/lib/serverToken";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET() {
  const token = await getServerToken();

  try {
    const res = await fetch(`${BASE}/api/products/categories`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json([], { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json([], { status: 503 });
  }
}
