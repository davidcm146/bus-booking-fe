export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// Two-letter locale for the backend i18n middleware (reads Accept-Language).
export function apiLocale(): string {
  const tag = typeof navigator !== "undefined" ? navigator.language : "vi";
  return tag.slice(0, 2).toLowerCase() || "vi";
}

export function languageHeaders(): Record<string, string> {
  return { "Accept-Language": apiLocale() };
}

// GET a backend envelope ({success, data, error}) and unwrap data or throw.
export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...languageHeaders(),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    const err = new Error(json.error?.message ?? "Request failed");
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return json.data as T;
}
