import prisma from "@/lib/prisma";
import { LiveViewer } from "@/components/live/LiveViewer";
import { notFound } from "next/navigation";

export default async function LivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { 
      author: true, 
      comments: { 
        include: { author: true },
        orderBy: { createdAt: "desc" }
      } 
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <LiveViewer 
      post={post}
    />
  );
}
