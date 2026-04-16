export default function Loading() {
  return (
    <div className="flex h-screen bg-neo-bg overflow-hidden animate-pulse">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header skeleton */}
        <header className="h-14 border-b-2 border-neo-border bg-neo-surface flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-7 w-14 border-2 border-green-900 bg-green-950" />
            <div className="h-5 w-48 bg-zinc-700" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-7 w-7 border-2 border-neo-border bg-zinc-800" />
            <div className="h-4 w-20 bg-zinc-700" />
          </div>
        </header>

        {/* Content skeleton */}
        <main className="flex-1 overflow-y-auto p-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-8 w-3/4 bg-zinc-700" />
            <div className="h-4 w-full bg-zinc-800" />
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`h-4 bg-zinc-800 ${i % 5 === 4 ? "w-2/3" : "w-full"}`} />
            ))}
            <div className="pt-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-4 bg-zinc-800 ${i % 4 === 3 ? "w-3/4" : "w-full"}`} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* RIGHT: Comments sidebar skeleton */}
      <aside className="w-[400px] border-l-2 border-neo-border bg-neo-surface flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-neo-border">
          <div className="h-4 w-28 bg-zinc-700" />
        </div>
        <div className="p-4 border-b-2 border-neo-border space-y-2">
          <div className="h-24 w-full border-2 border-neo-border bg-zinc-800" />
          <div className="flex justify-end">
            <div className="h-8 w-32 bg-zinc-700" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 shrink-0 border-2 border-neo-border bg-zinc-800" />
              <div className="flex-1 border-2 border-neo-border bg-zinc-800 p-3 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-zinc-700" />
                  <div className="h-3 w-14 bg-zinc-700" />
                </div>
                <div className="h-3 w-full bg-zinc-700" />
                <div className="h-3 w-3/4 bg-zinc-700" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
