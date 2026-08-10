import type { AuthSession, LogInInput, SignUpInput, User } from "@/types/auth";

export const DEMO_OPERATOR_PHONE = "+84900000010";
// Demo credential for the seeded operator user (not a real secret).
export const DEMO_OPERATOR_PASSWORD = "password123";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const SESSION_KEY = "bus-booking:session";

// Backend returns id as number, role as "passenger"|"operator"|"admin".
// Frontend expects id as string, role as "customer"|"operator".
function mapUser(data: {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}): User {
  if (data.role === "operator") {
    return {
      id: String(data.id),
      name: data.name,
      email: data.email,
      role: "operator",
      operatorId: "operator-1",
    } as const;
  }
  return {
    id: String(data.id),
    name: data.name || data.phone,
    email: data.email,
    role: "customer",
    operatorId: null,
  } as const;
}

// Build a multipart/form-data body from field map (backend uses form binding).
function buildFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

async function postAuth(path: string, fields: Record<string, string>): Promise<AuthSession> {
  const res = await fetch(`${API_BASE}/api/v1/auth${path}`, {
    method: "POST",
    body: buildFormData(fields),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    const msg = json.error?.message ?? "Request failed";
    throw new Error(msg);
  }

  const data = json.data;
  const user = mapUser(data);
  const session: AuthSession = { user, token: data.token };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signUp(input: SignUpInput): Promise<AuthSession> {
  return postAuth("/signup", { phone: input.phone, password: input.password });
}

export async function logIn(input: LogInInput): Promise<AuthSession> {
  return postAuth("/login", { phone: input.phone, password: input.password });
}

export function loginWithGoogle() {
  window.location.href = `${API_BASE}/api/v1/auth/google`;
}

export async function handleGoogleCallback(code: string): Promise<AuthSession> {
  const res = await fetch(`${API_BASE}/api/v1/auth/google/callback?code=${encodeURIComponent(code)}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    const msg = json.error?.message ?? "Google login failed";
    throw new Error(msg);
  }
  const data = json.data;
  const user = mapUser(data);
  const session: AuthSession = { user, token: data.token };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token) return null;
    return parsed as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
}
