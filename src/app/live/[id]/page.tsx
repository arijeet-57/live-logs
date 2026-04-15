import prisma from "@/lib/prisma";
import { LiveViewer } from "@/components/live/LiveViewer";
import { notFound } from "next/navigation";

export default async function LivePage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post || !post.isLive) {
    // If post isn't live, maybe show an "Offline" screen
    return (
        <div className="h-screen flex items-center justify-center bg-neo-bg p-8">
            <div className="neo-card max-w-sm w-full text-center space-y-4">
                <h1 className="text-2xl font-bold tracking-tighter">OFFLINE</h1>
                <p className="text-xs opacity-60">This blog post is currently not being written live.</p>
                <button className="neo-btn w-full font-bold py-2">RETURN HOME</button>
            </div>
        </div>
    );
  }

  return (
    <LiveViewer 
      postId={post.id} 
      initialContent={post.content} 
      title={post.title} 
    />
  );
}
