"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Reply, Bell, X } from "lucide-react";
import { createComment } from "@/app/actions/comment";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";
import Link from "next/link";
import { formatDate } from "@/lib/format";

interface CommentNotification {
  id: string;
  author: { name: string; image?: string };
  content: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments: any[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialComments }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState<CommentNotification[]>([]);
  const { socket, emitNewComment } = useSocket(postId);
  const dismissTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Listen for incoming comment notifications from other users
  useEffect(() => {
    if (!socket) return;

    const handleCommentNotification = (comment: CommentNotification) => {
      // Add comment to the list in real time
      setComments((prev) => [comment, ...prev]);

      // Show a toast notification
      setNotifications((prev) => [...prev, comment]);

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        dismissNotification(comment.id);
      }, 5000);
      dismissTimers.current.set(comment.id, timer);
    };

    socket.on("comment-notification", handleCommentNotification);

    return () => {
      socket.off("comment-notification", handleCommentNotification);
    };
  }, [socket]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      dismissTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = dismissTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      dismissTimers.current.delete(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const comment = await createComment({
        content: newComment,
        postId,
      });
      // Optimistically add to local list
      setComments([comment, ...comments]);
      // Broadcast to other viewers in the room
      emitNewComment(comment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Toast Notification Stack */}
      <div className="absolute top-16 left-0 right-0 z-50 px-4 space-y-2 pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto flex items-start gap-3 bg-neo-surface border-2 border-neo-border neo-shadow p-3 animate-in slide-in-from-top-2 duration-300"
          >
            <div className="shrink-0 w-7 h-7 neo-border bg-neo-bg flex items-center justify-center overflow-hidden">
              {notif.author.image ? (
                <img
                  src={notif.author.image}
                  alt={notif.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-black">
                  {notif.author.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Bell className="w-3 h-3 text-neo-accent shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neo-accent">
                  New Comment
                </span>
              </div>
              <p className="text-[10px] font-bold opacity-80 truncate">
                <span className="text-foreground">{notif.author.name}</span>
                {": "}
                {notif.content}
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="shrink-0 p-0.5 hover:opacity-100 opacity-40 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="p-4 border-b-2 border-neo-border flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
          <MessageSquare className="w-4 h-4" />
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="p-4 space-y-2 shrink-0 border-b-2 border-neo-border">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Post a comment..."
            className="w-full neo-card p-4 text-xs min-h-[100px] focus:outline-none focus:border-neo-accent resize-none bg-neo-bg leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              disabled={isSubmitting}
              className="neo-btn py-1.5 px-6 text-xs font-bold uppercase tracking-widest bg-neo-accent hover:bg-zinc-600 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? "POSTING..." : "POST COMMENT"}
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 text-center neo-card bg-neo-surface mx-4 my-4 shrink-0">
          <p className="text-xs opacity-60 mb-4">You must be authenticated to join the discussion.</p>
          <Link
            href="/auth/signin"
            className="neo-btn py-2 px-6 text-[10px] font-bold uppercase tracking-widest bg-neo-bg"
          >
            SIGN IN
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="group relative">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 neo-border bg-zinc-800 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                {comment.author.image ? (
                  <img src={comment.author.image} alt={comment.author.name} className="w-full h-full object-cover" />
                ) : (
                  comment.author.name?.[0].toUpperCase()
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="bg-neo-bg neo-border p-4 text-xs neo-shadow-accent/20 group-hover:neo-shadow-accent transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-neo-accent">{comment.author.name}</span>
                    <span className="text-[10px] opacity-40 uppercase">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="opacity-80 leading-relaxed font-medium">{comment.content}</p>
                </div>
                <button className="text-[10px] font-bold opacity-40 hover:opacity-100 flex items-center gap-1 uppercase transition-opacity">
                  <Reply className="w-3 h-3" /> Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
