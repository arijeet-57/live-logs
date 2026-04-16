"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSocket } from "@/hooks/useSocket";
import { Radio, Users, MessageSquare, Clock } from "lucide-react";
import { CommentSection } from "@/components/blog/CommentSection";
import { formatDate, formatDateTime } from "@/lib/format";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LiveViewerProps {
  post: any;
}

export const LiveViewer: React.FC<LiveViewerProps> = ({ post }) => {
  const [content, setContent] = useState(post.content);
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useSocket(post.id);

  useEffect(() => {
    if (!socket) return;

    socket.on("content-sync", (newContent: string) => {
      setContent(newContent);
    });

    socket.on("typing-indicator", (author: string) => {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timeout);
    });

    return () => {
      socket.off("content-sync");
      socket.off("typing-indicator");
    };
  }, [socket]);

  return (
    <div className="flex h-screen bg-neo-bg overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b-2 border-neo-border bg-neo-surface flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {post.isLive ? (
              <div className="flex items-center gap-2 text-xs font-bold bg-green-950 text-green-500 border-2 border-green-900 px-2 py-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                LIVE
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold bg-zinc-900 text-zinc-500 border-2 border-zinc-800 px-2 py-1 uppercase">
                <Clock className="w-3.5 h-3.5" />
                Archived {post.lastLiveAt && `• ${formatDate(post.lastLiveAt)}`}
              </div>
            )}
            <h1 className="font-bold tracking-tight line-clamp-1">{post.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold opacity-60">
             <ThemeToggle />
             {post.isLive && (
               <>
                 <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>EYES ON: 1</span>
                 </div>
                 {isTyping && <span className="text-green-500 animate-bounce">Blake is writing...</span>}
               </>
             )}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <article className="max-w-3xl mx-auto prose prose-invert font-mono">
             <ReactMarkdown>{content}</ReactMarkdown>
             {!post.isLive && post.lastLiveAt && (
               <div className="mt-12 pt-8 border-t-2 border-neo-border opacity-40 text-xs italic uppercase">
                 End of live session. This log was captured on {formatDateTime(post.lastLiveAt)}.
               </div>
             )}
          </article>
        </main>
      </div>

      {/* Sidebar: Comments */}
      <aside className="w-[400px] border-l-2 border-neo-border bg-neo-surface flex flex-col shrink-0">
         <CommentSection postId={post.id} initialComments={post.comments} />
      </aside>
    </div>
  );
};
