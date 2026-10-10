import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { signUp, logIn, getSession, clearSession, DEMO_OPERATOR_PHONE } from "@/lib/auth/authService";

const API_BASE = "http://localhost:8080";
// Dummy values for tests only — not real credentials.
const TEST_PASSWORD = "test-password-value";
const WRONG_PASSWORD = "test-wrong-value";

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("signUp", () => {
  it("sends multipart form data to /api/v1/auth/signup and stores the session", async () => {
    const fetchMock = mockFetchResponse({
      success: true,
      data: {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        phone: "+84901234567",
        role: "passenger",
        token: "jwt-abc",
      },
    });

    const session = await signUp({ phone: "+84901234567", password: TEST_PASSWORD });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE}/api/v1/auth/signup`);
    expect(init?.method).toBe("POST");
    expect(init?.body).toBeInstanceOf(FormData);

    const fd = init?.body as FormData;
    expect(fd.get("phone")).toBe("+84901234567");
    expect(fd.get("password")).toBe(TEST_PASSWORD);

    expect(session.user.id).toBe("1");
    expect(session.user.role).toBe("customer");
    expect(session.token).toBe("jwt-abc");

    const stored = JSON.parse(localStorage.getItem("bus-booking:session")!);
    expect(stored.token).toBe("jwt-abc");
  });

  it("maps the real backend shape (fullName, empty-string email/phone)", async () => {
    mockFetchResponse({
      success: true,
      data: {
        id: 7,
        fullName: "",
        email: "",
        phone: "+84901234567",
        role: "passenger",
        token: "jwt-be",
      },
    });

    const session = await signUp({ phone: "+84901234567", password: TEST_PASSWORD });

    expect(session.user.id).toBe("7");
    expect(session.user.role).toBe("customer");
    if (session.user.role === "customer") {
      expect(session.user.name).toBe("+84901234567");
    }
    expect(session.token).toBe("jwt-be");
  });

  it("maps Google users (fullName set, phone empty)", async () => {
    mockFetchResponse({
      success: true,
      data: {
        id: 9,
        fullName: "Alice Nguyen",
        email: "alice@gmail.com",
        phone: "",
        role: "passenger",
        token: "jwt-google",
      },
    });

    const session = await signUp({ phone: "+84901234567", password: TEST_PASSWORD });

    expect(session.user.role).toBe("customer");
    if (session.user.role === "customer") {
      expect(session.user.name).toBe("Alice Nguyen");
      expect(session.user.email).toBe("alice@gmail.com");
    }
    expect(session.token).toBe("jwt-google");
  });

  it("maps operator role correctly", async () => {
    mockFetchResponse({
      success: true,
      data: {
        id: 1,
        name: "Phương Trang Operations",
        email: "operator@busgo.app",
        phone: "+84900000010",
        role: "operator",
        token: "jwt-op",
      },
    });

    const session = await signUp({ phone: "+84900000010", password: TEST_PASSWORD });

    expect(session.user.role).toBe("operator");
    if (session.user.role === "operator") {
      expect(session.user.operatorId).toBe("operator-1");
    }
  });

  it("throws on API error", async () => {
    mockFetchResponse({
      success: false,
      error: { message: "Phone already registered" },
    }, false, 409);

    await expect(signUp({ phone: "+84901234567", password: TEST_PASSWORD }))
      .rejects.toThrow("Phone already registered");
  });
});

describe("logIn", () => {
  it("sends multipart form data to /api/v1/auth/login", async () => {
    const fetchMock = mockFetchResponse({
      success: true,
      data: {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        phone: "+84901234567",
        role: "passenger",
        token: "jwt-xyz",
      },
    });

    const session = await logIn({ phone: "+84901234567", password: TEST_PASSWORD });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE}/api/v1/auth/login`);
    expect(init?.method).toBe("POST");
    expect(init?.body).toBeInstanceOf(FormData);

    expect(session.user.id).toBe("1");
    expect(session.token).toBe("jwt-xyz");
  });

  it("throws on invalid credentials", async () => {
    mockFetchResponse({
      success: false,
      error: { message: "Invalid credentials" },
    }, false, 401);

    await expect(logIn({ phone: "+84900000000", password: WRONG_PASSWORD }))
      .rejects.toThrow("Invalid credentials");
  });
});

describe("getSession", () => {
  it("returns null when no session is stored", () => {
    expect(getSession()).toBeNull();
  });

  it("returns the stored session", () => {
    const session = {
      user: { id: "1", name: "Alice", email: "a@b.com", role: "customer", operatorId: null },
      token: "jwt-123",
    };
    localStorage.setItem("bus-booking:session", JSON.stringify(session));

    const result = getSession();
    expect(result?.token).toBe("jwt-123");
    expect(result?.user.id).toBe("1");
  });

  it("returns null for malformed JSON", () => {
    localStorage.setItem("bus-booking:session", "not-json");
    expect(getSession()).toBeNull();
  });

  it("returns null when token is missing", () => {
    localStorage.setItem("bus-booking:session", JSON.stringify({ user: { id: "1" } }));
    expect(getSession()).toBeNull();
  });
});

describe("clearSession", () => {
  it("removes the session from localStorage", () => {
    localStorage.setItem("bus-booking:session", '{"token":"abc"}');
    clearSession();
    expect(localStorage.getItem("bus-booking:session")).toBeNull();
  });
});

describe("DEMO_OPERATOR_PHONE", () => {
  it("exports the seeded operator phone", () => {
    expect(DEMO_OPERATOR_PHONE).toBe("+84900000010");
  });
});
