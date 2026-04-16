import prisma from "@/lib/prisma";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LiveToggle } from "@/components/editor/LiveToggle";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DeletePostButton } from "@/components/blog/DeletePostButton";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (session?.user?.email !== "admin@livelog.dev") {
    redirect(`/live/${id}`);
  }

  const post = await prisma.post.findUnique({
    where: { id: id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Editor Header */}
      <header className="h-14 border-b-2 border-neo-border bg-neo-surface flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="neo-btn p-1.5">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Editing</span>
            <h1 className="text-sm font-bold tracking-tight">{post.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link 
            href={`/live/${post.id}`} 
            target="_blank"
            className="text-[10px] font-bold opacity-50 hover:opacity-100 uppercase tracking-widest mr-2"
          >
            Preview Public
          </Link>
          <LiveToggle postId={post.id} isLive={post.isLive} />
          <DeletePostButton postId={post.id} />
          <button className="neo-btn px-4 py-1.5 text-xs font-bold neo-btn-accent">
            PUBLISH
          </button>
        </div>
      </header>

      {/* Editor Main */}
      <main className="flex-1 overflow-hidden">
        <MarkdownEditor 
          postId={post.id} 
          initialContent={post.content} 
          isLive={post.isLive} 
        />
      </main>
    </div>
  );
}
