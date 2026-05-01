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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("homvera_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  const saveUser = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem("homvera_user", JSON.stringify(u));
  };

  const loginWithEmail = async (email: string, _password: string) => {
    setLoading(true);
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: _password }) });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message);
      // saveUser(data.user);
      await new Promise(r => setTimeout(r, 800));
      saveUser({ id: "1", name: email.split("@")[0], email, role: "user", userRole: "buyer" });
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, _password: string, name: string) => {
    setLoading(true);
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: _password, name }) });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message);
      // saveUser(data.user);
      await new Promise(r => setTimeout(r, 800));
      saveUser({ id: "1", name, email, role: "user", userRole: "buyer" });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // TODO: replace with real Google OAuth
      // Option A Firebase:  signInWithPopup(auth, new GoogleAuthProvider())
      // Option B Supabase:  supabase.auth.signInWithOAuth({ provider: "google" })
      // Option C Backend:   window.location.href = "/api/auth/google"
      await new Promise(r => setTimeout(r, 800));
      saveUser({ id: "g_1", name: "Google User", email: "user@gmail.com", role: "user", userRole: "buyer" });
    } finally {
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
