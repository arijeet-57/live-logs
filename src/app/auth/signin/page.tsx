"use client";

import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Terminal,
  Lock,
  User,
  Mail,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoadingState = "google" | "github" | "email" | "credentials" | null;

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState<LoadingState>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    getProviders().then((providers) => {
      setAvailableProviders(Object.keys(providers || {}));
    });
  }, []);

  const handleOAuth = async (provider: "google" | "github") => {
    setError("");
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading("email");
    try {
      const res = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });
      if (res?.error) {
        setError("Could not send magic link. Check your email address.");
      } else {
        setEmailSent(true);
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("credentials");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid credentials. System access denied.");
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md space-y-3">

        {/* ── Header ── */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center">
            <div className="w-14 h-14 neo-border bg-neo-surface flex items-center justify-center neo-shadow">
              <Terminal className="w-7 h-7" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              LIVE_LOG ACCESS
            </h1>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">
              Authenticate to read, comment & join live sessions
            </p>
          </div>
        </div>

        {/* ── OAuth Section ── */}
        <div className="neo-card bg-neo-surface space-y-2 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
            Quick Access — OAuth
          </p>

          {availableProviders.includes("google") && (
            <button
              id="btn-google-signin"
              onClick={() => handleOAuth("google")}
              disabled={!!loading}
              className="w-full neo-btn py-3 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neo-accent transition-colors disabled:opacity-50"
            >
              {loading === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading === "google" ? "Connecting..." : "Continue with Google"}
            </button>
          )}

          {availableProviders.includes("github") && (
            <button
              id="btn-github-signin"
              onClick={() => handleOAuth("github")}
              disabled={!!loading}
              className="w-full neo-btn py-3 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neo-accent transition-colors disabled:opacity-50"
            >
              {loading === "github" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              )}
              {loading === "github" ? "Connecting..." : "Continue with GitHub"}
            </button>
          )}

          {!availableProviders.includes("google") && !availableProviders.includes("github") && (
            <p className="text-[10px] opacity-40 text-center py-2">
              No OAuth providers configured — add GOOGLE_CLIENT_ID / GITHUB_ID to .env
            </p>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-px bg-neo-border opacity-40" />
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-neo-border opacity-40" />
        </div>

        {/* ── Email Magic Link ── */}
        <div className="neo-card bg-neo-surface p-5 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
            Magic Link — Email Verification
          </p>

          {emailSent ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
              <div>
                <p className="text-sm font-bold">Check your inbox</p>
                <p className="text-[10px] opacity-50 mt-1">
                  Magic link sent to{" "}
                  <span className="text-neo-accent font-bold">{email}</span>
                </p>
                <p className="text-[10px] opacity-40 mt-2">
                  (In development, check the server terminal for the link)
                </p>
              </div>
              <button
                onClick={() => { setEmailSent(false); setEmail(""); }}
                className="text-[10px] font-bold opacity-50 hover:opacity-100 uppercase tracking-widest transition-opacity"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-2" id="email-magic-link-form">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full neo-btn bg-neo-bg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neo-accent transition-colors"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <button
                id="btn-email-signin"
                type="submit"
                disabled={!!loading}
                className="w-full neo-btn py-2.5 font-bold text-xs uppercase tracking-widest bg-neo-accent hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading === "email" ? (
                  <><Loader2 className="w-3 h-3 animate-spin" />Sending...</>
                ) : (
                  <>Send Magic Link <ArrowRight className="w-3 h-3" /></>
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="p-3 bg-red-950 border-2 border-red-900 text-red-400 text-[10px] font-bold uppercase tracking-wide">
            ⚠ {error}
          </div>
        )}

        {/* ── Admin Credentials (collapsible) ── */}
        <div className="neo-card bg-neo-surface p-5">
          <button
            id="btn-toggle-admin"
            onClick={() => setShowAdmin(!showAdmin)}
            className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Admin Terminal Access
            </span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${showAdmin ? "rotate-180" : ""}`}
            />
          </button>

          {showAdmin && (
            <form onSubmit={handleCredentials} className="mt-4 space-y-2" id="admin-credentials-form">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full neo-btn bg-neo-bg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full neo-btn bg-neo-bg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                id="btn-admin-signin"
                type="submit"
                disabled={!!loading}
                className="w-full neo-btn py-2.5 font-bold text-xs uppercase tracking-widest neo-btn-accent disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading === "credentials" ? (
                  <><Loader2 className="w-3 h-3 animate-spin" />Authenticating...</>
                ) : (
                  "Authenticate"
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── Back link ── */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-[10px] font-bold opacity-40 hover:opacity-100 uppercase tracking-widest transition-opacity"
          >
            ← Return to Station
          </Link>
        </div>
      </div>
    </div>
  );
}
