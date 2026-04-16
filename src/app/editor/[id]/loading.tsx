export default function Loading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <header className="h-14 border-b-2 border-neo-border bg-neo-surface flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 border-2 border-neo-border bg-zinc-800" />
          <div className="space-y-1">
            <div className="h-2 w-12 bg-zinc-700" />
            <div className="h-4 w-40 bg-zinc-700" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 border-2 border-neo-border bg-zinc-800" />
          <div className="h-4 w-20 bg-zinc-700" />
          <div className="h-7 w-20 border-2 border-neo-border bg-zinc-800" />
          <div className="h-7 w-7 border-2 border-neo-border bg-zinc-800" />
          <div className="h-7 w-20 border-2 border-neo-border bg-zinc-700" />
        </div>
      </header>

      {/* Editor split pane skeleton */}
      <main className="flex-1 flex overflow-hidden">
        {/* Write pane */}
        <div className="flex-1 border-r-2 border-neo-border bg-neo-bg p-6 space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`h-4 bg-zinc-800 ${i % 5 === 4 ? "w-0" : i % 3 === 2 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
        {/* Preview pane */}
        <div className="flex-1 bg-neo-surface p-6 space-y-3">
          <div className="h-8 w-3/4 bg-zinc-700" />
          <div className="h-4 w-full bg-zinc-800" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-4 bg-zinc-800 ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
      </main>

      {/* Status bar */}
      <div className="h-8 border-t-2 border-neo-border bg-neo-surface px-4 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="h-2 w-16 bg-zinc-700" />
          <div className="h-2 w-16 bg-zinc-700" />
        </div>
        <div className="h-2 w-20 bg-zinc-700" />
      </div>
    </div>
  );
}
