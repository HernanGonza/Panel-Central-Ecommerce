import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@/auth/types";
import { memoryAuthService } from "@/auth/memory-auth-service";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  loginAsDemo: (userId: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => memoryAuthService.getSession());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (input: { email: string; password: string }) => {
    setLoading(true);
    try {
      const next = await memoryAuthService.login(input);
      setSession(next);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAsDemo = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const next = await memoryAuthService.loginAsDemo(userId);
      setSession(next);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    void memoryAuthService.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, loading, login, loginAsDemo, logout }),
    [session, loading, login, loginAsDemo, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
