"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("kodi_token") : null;
    if (stored) setToken(stored);
  }, []);

  function login(t: string) {
    setToken(t);
    localStorage.setItem("kodi_token", t);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("kodi_token");
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
