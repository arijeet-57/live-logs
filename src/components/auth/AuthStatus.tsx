"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, ShieldCheck, User } from "lucide-react";
import { Session } from "next-auth";

export function AuthStatus({ session }: { session: Session | null }) {
  if (!session) {
    return (
      <Link 
        href="/auth/signin" 
        className="neo-btn w-full py-3 font-bold bg-neo-accent hover:bg-zinc-600 transition-colors uppercase text-xs tracking-widest text-center"
      >
        AUTHENTICATE TO ACCESS
      </Link>
    );
  }

  const isAdmin = session.user?.email === "admin@livelog.dev";

  return (
    <div className="space-y-4">
      <div className="neo-card bg-neo-surface p-4 flex items-center justify-between border-neo-accent/30">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 neo-border bg-neo-bg flex items-center justify-center">
              {isAdmin ? <ShieldCheck className="w-5 h-5 text-green-500" /> : <User className="w-5 h-5" />}
           </div>
           <div className="text-left">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                {isAdmin ? "ADMIN_ACCESS_LEVEL" : "USER_ACCESS_LEVEL"}
              </p>
              <p className="text-xs font-bold">{session.user?.name}</p>
           </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="neo-btn p-2 hover:bg-red-950 hover:text-red-500 hover:border-red-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
