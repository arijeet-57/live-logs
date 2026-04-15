"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useSocket } from "@/hooks/useSocket";
import { debounce } from "lodash"; // I need to install lodash or implement a simple debounce

const debounceHelper = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

interface EditorProps {
  postId: string;
  initialContent: string;
  isLive?: boolean;
}

export const MarkdownEditor: React.FC<EditorProps> = ({ postId, initialContent, isLive = false }) => {
  const [content, setContent] = useState(initialContent);
  const { emitContentUpdate, emitTyping } = useSocket(postId);

  // Debounced Content Update for Sockets (500ms)
  const debouncedSocketUpdate = useCallback(
    debounceHelper((newContent: string) => {
      if (isLive) {
        emitContentUpdate(newContent);
      }
    }, 500),
    [isLive, emitContentUpdate]
  );

  // Debounced Auto-save to DB (5s) - Placeholder for Server Action
  const debouncedAutoSave = useCallback(
    debounceHelper((newContent: string) => {
      console.log("Auto-saving to database...", newContent.slice(0, 20));
      // TODO: Call Server Action to save post
    }, 5000),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSocketUpdate(newContent);
    debouncedAutoSave(newContent);
    
    if (isLive) {
      emitTyping("Blake"); // Mocking author name
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col border-r-2 border-neo-border">
          <textarea
            value={content}
            onChange={handleChange}
            className="flex-1 p-6 bg-neo-bg text-foreground font-mono focus:outline-none resize-none leading-relaxed"
            placeholder="Write your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-neo-surface/30 prose prose-invert font-mono max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      
      <div className="p-2 border-t-2 border-neo-border bg-neo-surface text-[10px] flex justify-between items-center px-4">
        <div className="flex gap-4">
          <span>LINES: {content.split("\n").length}</span>
          <span>WORDS: {content.trim().split(/\s+/).length}</span>
        </div>
        <div className="flex gap-4 items-center">
          {isLive && <span className="flex items-center gap-1.5 font-bold animate-pulse text-green-500">● LIVE SYNC ACTIVE</span>}
          <span className="opacity-50 uppercase">AUTOSAVE: ON</span>
        </div>
      </div>
    </div>
  );
};
