"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSocket } from "@/hooks/useSocket";
import { Radio, Users } from "lucide-react";

interface LiveViewerProps {
  postId: string;
  initialContent: string;
  title: string;
}

export const LiveViewer: React.FC<LiveViewerProps> = ({ postId, initialContent, title }) => {
  const [content, setContent] = useState(initialContent);
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useSocket(postId);

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
    <div className="flex flex-col h-screen bg-neo-bg">
      <header className="h-14 border-b-2 border-neo-border bg-neo-surface flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold bg-green-950 text-green-500 border-2 border-green-900 px-2 py-1">
             <Radio className="w-3.5 h-3.5 animate-pulse" />
             LIVE
          </div>
          <h1 className="font-bold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold opacity-60">
           <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>EYES ON: 1</span>
           </div>
           {isTyping && <span className="text-green-500 animate-bounce">Blake is writing...</span>}
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-12">
        <article className="max-w-3xl mx-auto prose prose-invert font-mono">
           <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
};
