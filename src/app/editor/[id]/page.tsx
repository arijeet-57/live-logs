import prisma from "@/lib/prisma";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { notFound } from "next/navigation";
import { Radio, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function EditorPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
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
          <div className="flex items-center gap-2 mr-4">
             <span className="text-[10px] font-bold opacity-50 uppercase">Live Mode</span>
             <button className={`w-10 h-5 neo-border relative transition-colors ${post.isLive ? 'bg-green-600' : 'bg-zinc-800'}`}>
                <div className={`absolute top-0.5 bottom-0.5 w-3.5 neo-border bg-white transition-all ${post.isLive ? 'left-[22px]' : 'left-0.5'}`} />
             </button>
          </div>
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
