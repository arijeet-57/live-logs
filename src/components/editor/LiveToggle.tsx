"use client";

import { useState, useTransition } from "react";
import { toggleLiveMode } from "@/app/actions/post";
import { Loader2 } from "lucide-react";

export function LiveToggle({ postId, isLive }: { postId: string; isLive: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleLiveMode(postId, isLive);
      } catch (error) {
        console.error("Failed to toggle live mode:", error);
      }
    });
  };

  return (
    <div className="flex items-center gap-2 mr-4">
      <span className="text-[10px] font-bold opacity-50 uppercase">Live Mode</span>
      <button 
        onClick={handleToggle}
        disabled={isPending}
        className={`w-10 h-5 neo-border relative transition-colors ${isLive ? 'bg-green-600' : 'bg-zinc-800'} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className={`absolute top-0.5 bottom-0.5 w-3.5 neo-border bg-white transition-all ${isLive ? 'left-[22px]' : 'left-0.5'} flex items-center justify-center`}>
           {isPending && <Loader2 className="w-2 h-2 animate-spin text-zinc-900" />}
        </div>
      </button>
    </div>
  );
}
