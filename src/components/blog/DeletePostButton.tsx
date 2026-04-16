"use client";

import { Trash2 } from "lucide-react";
import { handleDeletePost } from "@/app/actions/post";
import { useTransition } from "react";

export function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  const onDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to permanently delete this log? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await handleDeletePost(postId);
        } catch (error) {
          console.error("Failed to delete post:", error);
          alert("Unauthorized or failed to delete post.");
        }
      });
    }
  };

  return (
    <button 
      onClick={onDelete}
      disabled={isPending}
      className="p-1.5 hover:bg-red-950 hover:text-red-500 transition-colors neo-border bg-neo-surface group-hover:opacity-100 opacity-0"
      title="Delete Post"
    >
      <Trash2 className={`w-3.5 h-3.5 ${isPending ? 'animate-pulse' : ''}`} />
    </button>
  );
}
