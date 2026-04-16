export default function Loading() {
  return (
    <div className="flex h-screen overflow-hidden animate-pulse">
      {/* LEFT: Post list skeleton */}
      <aside className="w-80 border-r-2 border-neo-border bg-neo-surface flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-neo-border flex items-center justify-between">
          <div className="h-5 w-28 bg-zinc-700" />
          <div className="flex gap-2">
            <div className="h-7 w-7 bg-zinc-700" />
            <div className="h-7 w-7 bg-zinc-700" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="h-3 w-20 bg-zinc-700 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-2 border-neo-border bg-neo-surface p-3 space-y-2 shadow-[4px_4px_0_0_var(--neo-shadow)]">
              <div className="flex justify-between">
                <div className="h-3 w-14 bg-zinc-700" />
                <div className="h-3 w-16 bg-zinc-700" />
              </div>
              <div className="h-4 w-full bg-zinc-700" />
              <div className="h-3 w-3/4 bg-zinc-700" />
            </div>
          ))}
        </div>
      </aside>

      {/* CENTER: Hero skeleton */}
      <main className="flex-1 bg-neo-bg flex items-center justify-center p-12">
        <div className="max-w-md w-full border-2 border-neo-border bg-zinc-900 shadow-[4px_4px_0_0_var(--neo-shadow)] p-6 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 border-2 border-neo-border bg-zinc-800" />
          </div>
          <div className="space-y-3 text-center">
            <div className="h-7 w-48 bg-zinc-700 mx-auto" />
            <div className="h-3 w-full bg-zinc-700" />
            <div className="h-3 w-3/4 bg-zinc-700 mx-auto" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 border-2 border-neo-border bg-zinc-800" />
            <div className="h-20 border-2 border-neo-border bg-zinc-800" />
          </div>
          <div className="h-10 w-full bg-zinc-700" />
        </div>
      </main>

      {/* RIGHT: Status skeleton */}
      <aside className="w-80 border-l-2 border-neo-border bg-neo-surface flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-neo-border">
          <div className="h-4 w-28 bg-zinc-700" />
        </div>
        <div className="p-6 space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-zinc-700" />
                <div className="h-3 w-12 bg-zinc-700" />
              </div>
              <div className="h-1.5 w-full bg-zinc-800 border-2 border-neo-border" />
            </div>
          ))}
          <div className="border-2 border-neo-border bg-neo-bg p-4 space-y-2">
            <div className="h-3 w-28 bg-zinc-700" />
            <div className="h-3 w-full bg-zinc-700" />
            <div className="h-3 w-5/6 bg-zinc-700" />
          </div>
        </div>
      </aside>
    </div>
  );
}
