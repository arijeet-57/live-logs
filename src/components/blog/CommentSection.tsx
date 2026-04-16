"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Reply } from "lucide-react";
import { createComment } from "@/app/actions/comment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatDate } from "@/lib/format";

interface CommentSectionProps {
  postId: string;
  initialComments: any[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialComments }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const comment = await createComment({
        content: newComment,
        postId
      });
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border-b-2 border-neo-border flex items-center justify-between">
        <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
          <MessageSquare className="w-4 h-4" />
          Comments ({comments.length})
        </h2>
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
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
        <div className="p-6 text-center neo-card bg-neo-surface mx-4">
           <p className="text-xs opacity-60 mb-4">You must be authenticated to join the discussion.</p>
           <Link href="/auth/signin" className="neo-btn py-2 px-6 text-[10px] font-bold uppercase tracking-widest bg-neo-bg">
             SIGN IN
           </Link>
        </div>
      )}

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
                {/* Simplified threading for now: just a reply button placeholder */}
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
