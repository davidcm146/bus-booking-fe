import type { AuthSession, CustomerUser, LogInInput, SignUpInput, User } from "@/types/auth";
import { delay } from "@/lib/delay";

const USERS_KEY = "bus-booking:users";
const SESSION_KEY = "bus-booking:session";
export const DEMO_OPERATOR_EMAIL = "operator@busgo.app";
export const DEMO_OPERATOR_PASSWORD = "operator-demo";

type StoredUser = CustomerUser & { readonly password: string };

const DEMO_OPERATOR: User = {
  id: "operator-demo-user",
  name: "Phương Trang Operations",
  email: DEMO_OPERATOR_EMAIL,
  role: "operator",
  operatorId: "operator-1",
};

function isStoredUser(value: unknown): value is StoredUser {
  if (!value || typeof value !== "object") return false;
  return "id" in value && typeof value.id === "string" && "name" in value && typeof value.name === "string" && "email" in value && typeof value.email === "string" && "password" in value && typeof value.password === "string";
}

function getUsers(): readonly StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredUser).map((user) => ({ ...user, role: "customer", operatorId: null }));
  } catch {
    return [];
  }
}

function saveUsers(users: readonly StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function generateToken(): string { return `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`; }

export async function signUp(input: SignUpInput): Promise<AuthSession> {
  await delay(200);
  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) throw new Error("Email already registered");
  const user: StoredUser = { id: crypto.randomUUID(), name: input.name, email: input.email, password: input.password, role: "customer", operatorId: null };
  saveUsers([...users, user]);
  const session: AuthSession = { user: { id: user.id, name: user.name, email: user.email, role: "customer", operatorId: null }, token: generateToken() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function logIn(input: LogInInput): Promise<AuthSession> {
  await delay(200);
  if (input.email.toLowerCase() === DEMO_OPERATOR_EMAIL && input.password === DEMO_OPERATOR_PASSWORD) {
    const session: AuthSession = { user: DEMO_OPERATOR, token: generateToken() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  const stored = getUsers().find((user) => user.email.toLowerCase() === input.email.toLowerCase() && user.password === input.password);
  if (!stored) throw new Error("Invalid email or password");
  const session: AuthSession = { user: { id: stored.id, name: stored.name, email: stored.email, role: "customer", operatorId: null }, token: generateToken() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object" || !("user" in parsed) || !("token" in parsed) || typeof parsed.token !== "string") return null;
    const user = parsed.user;
    if (!user || typeof user !== "object" || !("id" in user) || typeof user.id !== "string" || !("name" in user) || typeof user.name !== "string" || !("email" in user) || typeof user.email !== "string") return null;
    if ("role" in user && user.role === "operator" && "operatorId" in user && typeof user.operatorId === "string") return { user: { id: user.id, name: user.name, email: user.email, role: "operator", operatorId: user.operatorId }, token: parsed.token };
    return { user: { id: user.id, name: user.name, email: user.email, role: "customer", operatorId: null }, token: parsed.token };
  } catch {
    return null;
  }
}

export function clearSession() { if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY); }
