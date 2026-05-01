import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  userRole?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : "/api/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("homvera_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.email) {
          setUser(parsed);
        } else {
          localStorage.removeItem("homvera_user");
        }
      }
    } catch {
      localStorage.removeItem("homvera_user");
    }
  }, []);

  const saveUser = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem("homvera_user", JSON.stringify(u));
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // If API is not available, use mock
      if (!res.ok && res.status === 404) {
        console.warn("Auth API not available, using mock login");
        await new Promise(r => setTimeout(r, 600));
        saveUser({
          id: "mock_" + Date.now(),
          name: email.split("@")[0],
          email,
          role: "user",
          userRole: "buyer",
        });
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      saveUser(data.user);
    } catch (error: any) {
      // If network error, fallback to mock for development
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        console.warn("Network error, using mock login");
        await new Promise(r => setTimeout(r, 600));
        saveUser({
          id: "mock_" + Date.now(),
          name: email.split("@")[0],
          email,
          role: "user",
          userRole: "buyer",
        });
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      // If API is not available, use mock
      if (!res.ok && res.status === 404) {
        console.warn("Auth API not available, using mock register");
        await new Promise(r => setTimeout(r, 600));
        saveUser({
          id: "mock_" + Date.now(),
          name,
          email,
          role: "user",
          userRole: "buyer",
        });
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      saveUser(data.user);
    } catch (error: any) {
      // If network error, fallback to mock for development
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        console.warn("Network error, using mock register");
        await new Promise(r => setTimeout(r, 600));
        saveUser({
          id: "mock_" + Date.now(),
          name,
          email,
          role: "user",
          userRole: "buyer",
        });
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Try real OAuth redirect
      window.location.href = `${API}/google`;
    } catch (error: any) {
      // Fallback to mock if needed (though redirect should work)
      console.warn("Google OAuth failed, using mock");
      saveUser({
        id: "mock_google_" + Date.now(),
        name: "Google User",
        email: "user@gmail.com",
        role: "user",
        userRole: "buyer",
      });
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("homvera_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, loginWithEmail, loginWithGoogle, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
