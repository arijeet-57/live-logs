"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createComment(data: { content: string; postId: string; parentId?: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("You must be signed in to comment.");
  }

  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      postId: data.postId,
      authorId: (session.user as any).id,
      parentId: data.parentId || null,
    },
    include: {
      author: true
    }
  });

  revalidatePath(`/post/[slug]`, 'page');
  return comment;
}

export async function getCommentsForPost(postId: string) {
  return await prisma.comment.findMany({
    where: { 
      postId,
      parentId: null // Top level comments
    },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
          replies: {
            include: {
                author: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}
