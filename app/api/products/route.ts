import { NextRequest, NextResponse } from "next/server";
import { getServerToken } from "@/lib/serverToken";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  const token = await getServerToken();
  const params = request.nextUrl.searchParams.toString();
  const url = `${BASE}/api/products${params ? "?" + params : ""}`;

  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json([], { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 503 });
  }
}
