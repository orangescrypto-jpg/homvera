import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Login() {
  const [, navigate] = useLocation();
  const { loginWithEmail, loginWithGoogle, loading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      await loginWithEmail(email, password);
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      // Google OAuth redirects, this may not execute
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-serif font-semibold text-foreground">
              Homvera<span className="text-accent font-bold"> NG</span>
            </span>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button variant="outline" className="w-full gap-3 h-11" onClick={handleGoogleLogin} disabled={loading}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 my-5">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or sign in with email</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
