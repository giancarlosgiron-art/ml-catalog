// Server-only — never imported from client components
let _token: string | null = null;
let _tokenExpiry = 0;

export async function getServerToken(): Promise<string | null> {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const email = process.env.API_EMAIL;
  const password = process.env.API_PASSWORD;
  const base = "https://by-maria-lugo-production.up.railway.app";

  if (!email || !password) return null;

  try {
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    _token = data.token as string;
    _tokenExpiry = Date.now() + 6 * 24 * 60 * 60 * 1000; // 6 days
    return _token;
  } catch {
    return null;
  }
}
