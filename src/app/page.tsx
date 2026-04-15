import Link from "next/link";
import { Plus, Radio, Edit3, MessageSquare, Terminal } from "lucide-react";
import { getPosts, createPost } from "@/app/actions/post";
import prisma from "@/lib/prisma";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT PANEL: Blog List */}
      <aside className="w-80 border-r-2 border-neo-border bg-neo-surface flex flex-col">
        <div className="p-4 border-b-2 border-neo-border flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            LIVE_LOG
          </h1>
          <form action={async () => {
              "use server";
              // Placeholder: in a real app we'd get the current user ID
              // const post = await createPost("user-id");
              // redirect(`/editor/\${post.id}`);
          }}>
            <button className="neo-btn p-1.5 hover:bg-neo-accent transition-colors" type="submit">
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-neo-accent uppercase tracking-widest px-2">Recent Posts</h2>
            {posts.length === 0 ? (
               <div className="p-4 text-center text-xs opacity-40 italic">
                 No posts found. Create your first one.
               </div>
            ) : posts.map((post) => (
              <Link key={post.id} href={`/editor/${post.id}`} className="block">
                <div className="neo-card flex flex-col gap-2 cursor-pointer hover:border-neo-accent transition-colors">
                    <div className="flex justify-between items-start">
                    <span className={`text-[10px] px-1.5 py-0.5 font-bold ${post.published ? 'bg-green-900 border-green-800' : 'bg-neo-accent'}`}>
                        {post.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    <span className="text-[10px] opacity-50">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-sm leading-tight">{post.title}</h3>
                    <p className="text-xs opacity-60 line-clamp-2">{post.content || "Empty content..."}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* CENTER PANEL: Main Welcome / Empty State */}
      <main className="flex-1 bg-neo-bg flex flex-col relative overflow-y-auto items-center justify-center p-12">
        <div className="max-w-md w-full neo-card space-y-8 text-center bg-zinc-900">
          <div className="flex justify-center">
            <div className="w-16 h-16 neo-border bg-neo-surface flex items-center justify-center">
               <Radio className="w-8 h-8 text-green-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter">WELCOME TO LIVE_LOG</h2>
            <p className="text-sm opacity-60 font-medium">
              A minimalist, real-time blogging platform for developers.
              Write live, sync instantly, and build your audience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="neo-card p-4 text-left space-y-2 bg-neo-surface">
              <Edit3 className="w-5 h-5 text-neo-accent" />
              <h3 className="text-xs font-bold uppercase">Writing Mode</h3>
              <p className="text-[10px] opacity-50">Keyboard-first Markdown experience with live preview.</p>
            </div>
            <div className="neo-card p-4 text-left space-y-2 bg-neo-surface">
              <Radio className="w-5 h-5 text-green-500" />
              <h3 className="text-xs font-bold uppercase">Live Sync</h3>
              <p className="text-[10px] opacity-50">Broadcast your typing in real-time to your readers.</p>
            </div>
          </div>
          <button className="neo-btn w-full py-3 font-bold bg-neo-accent hover:bg-zinc-600 transition-colors">
            START WRITING NOW
          </button>
        </div>
      </main>

      {/* RIGHT PANEL: Global Presence / Info */}
      <aside className="w-80 border-l-2 border-neo-border bg-neo-surface flex flex-col">
        <div className="p-4 border-b-2 border-neo-border">
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
            <Terminal className="w-4 h-4" />
            System Status
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase opacity-50">
              <span>Socket Engine</span>
              <span className="text-green-500">Online</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 neo-border overflow-hidden">
              <div className="h-full bg-green-500 w-[95%]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase opacity-50">
              <span>Database (Prisma)</span>
              <span className="text-green-500">Connected</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 neo-border overflow-hidden">
              <div className="h-full bg-green-500 w-[100%]" />
            </div>
          </div>

          <div className="neo-card bg-neo-bg p-4 border-neo-accent/30">
            <h3 className="text-xs font-bold mb-2 flex items-center gap-2">
              <Plus className="w-3 h-3" />
              Developer Note
            </h3>
            <p className="text-[10px] opacity-60 leading-relaxed italic">
              "This platform is built with Neo-brutalism in mind. No fluff, just code and content. 
              Real-time sync handles ~500ms debounce to ensure smooth delivery across devices."
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
