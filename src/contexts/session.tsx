"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { SessionData } from "@/lib/session";
import api from "@/lib/api";

interface SessionContextType {
  session: SessionData | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  refresh: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const { data } = await api.get<SessionData>("/api/auth/session");
      if (data) {
        setSession(data);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const value = {
    session,
    loading,
    refresh: fetchSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};

export const useRequireAuth = () => {
  const { session, loading } = useSession();
  const isAuthenticated = session?.isLoggedIn;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated]);

  return { session, loading };
};
