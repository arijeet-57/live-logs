"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Terminal, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full neo-card bg-neo-surface space-y-8 p-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 neo-border bg-neo-bg flex items-center justify-center">
              <Lock className="w-6 h-6 text-neo-accent" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">Personnel Authorization</h1>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Access Restricted to Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 opacity-40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full neo-btn bg-neo-bg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neo-accent transition-colors"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 opacity-40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full neo-btn bg-neo-bg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neo-accent transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950 border-2 border-red-900 text-red-500 text-[10px] font-bold uppercase animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full neo-btn neo-btn-accent py-3 font-bold uppercase tracking-widest text-xs hover:bg-zinc-600 transition-colors"
          >
            Authenticate
          </button>
        </form>

        <div className="pt-4 border-t-2 border-neo-border flex justify-between items-center opacity-40">
           <div className="flex items-center gap-2 text-[10px] font-bold">
              <Terminal className="w-3 h-3" />
              SYSTEM_AUTH_v1.0
           </div>
           <button 
             onClick={() => signIn("github")}
             className="text-[10px] font-bold hover:underline"
           >
             GITHUB_SSO
           </button>
        </div>
      </div>
    </div>
  );
}
