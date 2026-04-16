import Link from "next/link";
import { Plus, Radio, Edit3, Terminal, Zap } from "lucide-react";
import { getPosts, handleCreatePost, getPublishedPosts } from "@/app/actions/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DeletePostButton } from "@/components/blog/DeletePostButton";
import { formatDate } from "@/lib/format";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === "admin@livelog.dev";

  const allPosts = await (isAdmin ? getPosts() : getPublishedPosts());
  const livePosts = allPosts.filter((p) => p.isLive);
  const regularPosts = allPosts.filter((p) => !p.isLive);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ═══ LEFT PANEL: Post List ═══ */}
      <aside className="w-80 border-r-2 border-neo-border bg-neo-surface flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-neo-border flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            LIVE_LOG
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAdmin && (
              <form action={handleCreatePost}>
                <button
                  id="btn-create-post"
                  className="neo-btn p-1.5 hover:bg-neo-accent transition-colors"
                  type="submit"
                  title="New post"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ── LIVE NOW section ── */}
          {livePosts.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-[10px] font-black uppercase tracking-widest px-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-500">Live Now</span>
              </h2>
              {livePosts.map((post) => (
                <div key={post.id} className="group relative">
                  <Link
                    href={isAdmin ? `/editor/${post.id}` : `/live/${post.id}`}
                    id={`live-post-${post.id}`}
                    className="block"
                  >
                    <div className="border-2 border-green-800 bg-green-950/30 p-3 flex flex-col gap-2 cursor-pointer hover:border-green-600 transition-colors shadow-[4px_4px_0_0_rgba(22,101,52,0.4)]">
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                          Broadcasting
                        </span>
                      </div>
                      <h3 className="font-bold text-sm leading-tight text-green-100">{post.title}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] opacity-60">
                          {formatDate(post.createdAt)}
                        </p>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-wide border border-green-800 px-1.5 py-0.5">
                          Join →
                        </span>
                      </div>
                    </div>
                  </Link>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeletePostButton postId={post.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Regular Posts ── */}
          <div className="space-y-2">
            {livePosts.length > 0 && regularPosts.length > 0 && (
              <h2 className="text-[10px] font-bold text-neo-accent uppercase tracking-widest px-2">
                Recent Posts
              </h2>
            )}
            {livePosts.length === 0 && (
              <h2 className="text-[10px] font-bold text-neo-accent uppercase tracking-widest px-2">
                Recent Posts
              </h2>
            )}

            {regularPosts.length === 0 && livePosts.length === 0 ? (
              <div className="p-4 text-center text-xs opacity-40 italic">
                {isAdmin ? "No posts yet. Create your first one." : "No published posts yet."}
              </div>
            ) : (
              regularPosts.map((post) => (
                <div key={post.id} className="group relative">
                  <Link
                    href={isAdmin ? `/editor/${post.id}` : `/post/${post.slug}`}
                    id={`post-${post.id}`}
                    className="block"
                  >
                    <div className="neo-card flex flex-col gap-2 cursor-pointer hover:border-neo-accent transition-colors p-3">
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 font-bold ${
                            post.published ? "bg-green-900 text-green-300" : "bg-neo-accent"
                          }`}
                        >
                          {post.published ? "PUBLISHED" : "DRAFT"}
                        </span>
                        <span className="text-[10px] opacity-50">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm leading-tight">{post.title}</h3>
                      <p className="text-xs opacity-60 line-clamp-2">
                        {post.content || "Empty content..."}
                      </p>
                    </div>
                  </Link>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeletePostButton postId={post.id} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* ═══ CENTER PANEL ═══ */}
      <main className="flex-1 bg-neo-bg flex flex-col relative overflow-y-auto items-center justify-center p-12 gap-6">

        {/* Live discovery card — shown prominently when a session is live */}
        {livePosts.length > 0 && (
          <div className="max-w-md w-full border-2 border-green-800 bg-green-950/20 shadow-[8px_8px_0_0_rgba(22,101,52,0.4)] p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-green-800 bg-green-950 flex items-center justify-center">
                <Radio className="w-5 h-5 text-green-500 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                  Live Session Active
                </p>
                <p className="text-xs opacity-60 font-medium mt-0.5">
                  A log is being written in real-time right now
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {livePosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/live/${post.id}`}
                  id={`join-live-${post.id}`}
                  className="flex items-center justify-between border-2 border-green-800 bg-green-950/40 px-4 py-3 hover:border-green-600 hover:bg-green-950/60 transition-all group"
                >
                  <div>
                    <p className="text-sm font-bold text-green-100">{post.title}</p>
                    <p className="text-[10px] opacity-50 mt-0.5">by {post.author.name}</p>
                  </div>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                    Join →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Welcome card */}
        <div className="max-w-md w-full neo-card space-y-7 text-center bg-zinc-900">
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
              <p className="text-[10px] opacity-50">Keyboard-first Markdown with live preview.</p>
            </div>
            <div className="neo-card p-4 text-left space-y-2 bg-neo-surface">
              <Zap className="w-5 h-5 text-green-500" />
              <h3 className="text-xs font-bold uppercase">Live Sync</h3>
              <p className="text-[10px] opacity-50">Watch the author write in real-time. Join the stream.</p>
            </div>
          </div>
          <div className="w-full">
            <AuthStatus session={session} />
          </div>
        </div>
      </main>

      {/* ═══ RIGHT PANEL: System Status ═══ */}
      <aside className="w-72 border-l-2 border-neo-border bg-neo-surface flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-neo-border">
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
            <Terminal className="w-4 h-4" />
            System Status
          </h2>
        </div>

        <div className="p-5 space-y-5">
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
              <span>Database</span>
              <span className="text-green-500">Connected</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 neo-border overflow-hidden">
              <div className="h-full bg-green-500 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase opacity-50">
              <span>Live Sessions</span>
              <span className={livePosts.length > 0 ? "text-green-500" : "text-zinc-500"}>
                {livePosts.length} Active
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 neo-border overflow-hidden">
              <div
                className={`h-full transition-all ${livePosts.length > 0 ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`}
                style={{ width: livePosts.length > 0 ? "100%" : "0%" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase opacity-50">
              <span>Published Logs</span>
              <span>{allPosts.filter(p => p.published).length}</span>
            </div>
          </div>

          <div className="neo-card bg-neo-bg p-4 border-neo-accent/30 mt-4">
            <h3 className="text-xs font-bold mb-2 flex items-center gap-2">
              <Plus className="w-3 h-3" />
              Developer Note
            </h3>
            <p className="text-[10px] opacity-60 leading-relaxed italic">
              &quot;Built with Neo-brutalism in mind. Real-time sync handles ~500ms debounce.
              Sign in to comment and join live sessions.&quot;
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
