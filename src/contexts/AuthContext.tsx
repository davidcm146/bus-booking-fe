"use client";

import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import type { User, AuthSession, SignUpInput, LogInInput } from "@/types/auth";
import { signUp as signUpService, logIn as logInService, getSession, clearSession } from "@/lib/auth/authService";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (input: SignUpInput) => Promise<void>;
  logIn: (input: LogInInput) => Promise<void>;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const FAKE_USER: User = {
  id: "demo-user",
  name: "Guest User",
  email: "guest@busgo.app",
  role: "customer",
  operatorId: null,
};

const FAKE_SESSION: AuthSession = {
  user: FAKE_USER,
  token: "demo-token",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getSession();
      if (session) {
        setUser(session.user);
      } else {
        localStorage.setItem("bus-booking:session", JSON.stringify(FAKE_SESSION));
        setUser(FAKE_USER);
      }
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const session = await signUpService(input);
    setUser(session.user);
  }, []);

  const logIn = useCallback(async (input: LogInInput) => {
    const session = await logInService(input);
    setUser(session.user);
  }, []);

  const logOut = useCallback(() => {
    clearSession();
    setUser(FAKE_USER);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, logIn, logOut }),
    [loading, logIn, logOut, signUp, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
