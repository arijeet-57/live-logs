export default function Loading() {
  return (
    <div className="flex h-screen overflow-hidden animate-pulse">
      {/* LEFT: Metadata sidebar skeleton */}
      <aside className="w-64 border-r-2 border-neo-border bg-neo-surface hidden md:flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-neo-border">
          <div className="h-8 w-full border-2 border-neo-border bg-zinc-800" />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="space-y-3">
            <div className="h-2 w-16 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-zinc-700" />
              <div className="h-3 w-24 bg-zinc-700" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-zinc-700" />
              <div className="h-3 w-20 bg-zinc-700" />
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER: Article skeleton */}
      <main className="flex-1 overflow-y-auto bg-neo-bg">
        <div className="max-w-3xl mx-auto px-6 py-20 space-y-10">
          {/* Tags */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="h-4 w-12 bg-zinc-700" />
              <div className="h-4 w-16 bg-zinc-700" />
            </div>
            {/* Title */}
            <div className="space-y-2 border-b-8 border-neo-border pb-8">
              <div className="h-14 w-full bg-zinc-700" />
              <div className="h-14 w-4/5 bg-zinc-700" />
            </div>
          </div>
          {/* Body paragraphs */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`h-4 bg-zinc-800 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-4 bg-zinc-800 ${i % 4 === 3 ? "w-3/4" : "w-full"}`} />
            ))}
          </div>
        </div>
      </main>

      {/* RIGHT: Comments skeleton */}
      <aside className="w-96 border-l-2 border-neo-border bg-neo-surface hidden lg:flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-neo-border">
          <div className="h-4 w-28 bg-zinc-700" />
        </div>
        <div className="p-4 space-y-4 border-b-2 border-neo-border">
          <div className="h-24 w-full border-2 border-neo-border bg-zinc-800" />
          <div className="flex justify-end">
            <div className="h-8 w-32 bg-zinc-700" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 shrink-0 border-2 border-neo-border bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="border-2 border-neo-border bg-zinc-800 p-3 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-zinc-700" />
                    <div className="h-3 w-14 bg-zinc-700" />
                  </div>
                  <div className="h-3 w-full bg-zinc-700" />
                  <div className="h-3 w-4/5 bg-zinc-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
