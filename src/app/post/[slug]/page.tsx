import { getPostBySlug } from "@/app/actions/post";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CommentSection } from "@/components/blog/CommentSection";
import Link from "next/link";
import { ArrowLeft, Clock, User, Radio } from "lucide-react";
import { formatDate } from "@/lib/format";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Blog Navigation (Left) */}
      <aside className="w-64 border-r-2 border-neo-border bg-neo-surface hidden md:flex flex-col">
          <div className="p-4 border-b-2 border-neo-border">
              <Link href="/" className="neo-btn w-full gap-2 text-xs font-bold py-2">
                  <ArrowLeft className="w-4 h-4" />
                  STATION_HOME
              </Link>
          </div>
          <div className="flex-1 p-6 space-y-8">
              <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase opacity-40 tracking-[0.2em]">Metadata</h3>
                  <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-medium">
                          <User className="w-3.5 h-3.5 opacity-50" />
                          {post.author.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5 opacity-50" />
                          {formatDate(post.createdAt)}
                      </div>
                  </div>
              </div>
              {post.isLive && (
                  <Link href={`/live/${post.id}`} className="neo-btn w-full bg-green-950 border-green-800 text-green-500 py-3 gap-2 text-xs font-bold animate-pulse">
                      <Radio className="w-4 h-4" />
                      COMM_LINK_LIVE
                  </Link>
              )}
          </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-neo-bg">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 lg:py-24 space-y-12">
           <header className="space-y-6">
              <div className="flex gap-2">
                 {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black uppercase bg-neo-accent px-2 py-0.5">{tag}</span>
                 ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] border-b-8 border-neo-border pb-8">
                {post.title.toUpperCase()}
              </h1>
           </header>

           <article className="prose prose-invert prose-zinc max-w-none font-mono text-lg leading-relaxed selection:bg-neo-accent selection:text-white">
              <ReactMarkdown>{post.content}</ReactMarkdown>
           </article>

           <footer className="pt-12 border-t-4 border-neo-border">
              <div className="neo-card bg-neo-surface flex items-center justify-between p-4">
                 <p className="text-xs font-bold uppercase opacity-50">END_OF_TRANSCRIPT</p>
                 <div className="flex gap-4">
                    {/* Share placeholders */}
                    <div className="w-6 h-6 neo-border bg-neo-bg" />
                    <div className="w-6 h-6 neo-border bg-neo-bg" />
                 </div>
              </div>
           </footer>
        </div>
      </main>

      {/* Persistence Panel (Right) */}
      <aside className="w-96 border-l-2 border-neo-border bg-neo-surface hidden lg:flex flex-col overflow-hidden">
         <CommentSection postId={post.id} initialComments={post.comments} />
      </aside>
    </div>
  );
}
