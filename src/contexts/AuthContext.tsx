"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import type { User, SignUpInput, LogInInput } from "@/types/auth";
import { signUp as signUpService, logIn as logInService, loginWithGoogle, handleGoogleCallback, getSession, clearSession, fetchMe, saveSession } from "@/lib/auth/authService";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (input: SignUpInput) => Promise<void>;
  logIn: (input: LogInInput) => Promise<void>;
  loginWithGoogle: () => void;
  completeGoogleLogin: (code: string) => Promise<void>;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    setUser(session.user);
    // Revalidate against the backend; drop the session only on 401, keep it offline.
    let cancelled = false;
    fetchMe(session.token).then(
      (fresh) => {
        if (cancelled) return;
        setUser(fresh);
        saveSession({ user: fresh, token: session.token });
        setLoading(false);
      },
      (err) => {
        if (cancelled) return;
        if (err instanceof Error && (err as Error & { status?: number }).status === 401) {
          clearSession();
          setUser(null);
        }
        setLoading(false);
      },
    );
    return () => { cancelled = true; };
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const session = await signUpService(input);
    setUser(session.user);
  }, []);

  const logIn = useCallback(async (input: LogInInput) => {
    const session = await logInService(input);
    setUser(session.user);
  }, []);

  const completeGoogleLogin = useCallback(async (code: string) => {
    const session = await handleGoogleCallback(code);
    setUser(session.user);
  }, []);

  const logOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = { user, loading, signUp, logIn, loginWithGoogle, completeGoogleLogin, logOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
