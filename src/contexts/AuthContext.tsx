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

const STORAGE_KEY = "homvera_user";
const ACCOUNTS_KEY = "homvera_accounts";

function getAccounts(): Record<string, { name: string; email: string; passwordHash: string }> {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "{}"); } catch { return {}; }
}

function saveAccount(email: string, name: string, password: string) {
  const accounts = getAccounts();
  accounts[email.toLowerCase()] = { name, email, passwordHash: btoa(password) };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  const saveUser = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const accounts = getAccounts();
      const account = accounts[email.toLowerCase()];
      if (!account) throw new Error("No account found with this email. Please register first.");
      if (account.passwordHash !== btoa(password)) throw new Error("Incorrect password. Please try again.");
      saveUser({ id: btoa(email), name: account.name, email: account.email, role: "user", userRole: "buyer" });
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const accounts = getAccounts();
      if (accounts[email.toLowerCase()]) throw new Error("An account with this email already exists. Please sign in.");
      saveAccount(email, name, password);
      saveUser({ id: btoa(email), name, email, role: "user", userRole: "buyer" });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const mockEmail = "google@homvera.test";
      const mockName = "Google User";
      saveAccount(mockEmail, mockName, "google-oauth");
      saveUser({ id: "google_user", name: mockName, email: mockEmail, role: "user", userRole: "buyer" });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
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
