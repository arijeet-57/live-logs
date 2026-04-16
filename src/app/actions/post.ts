"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createPost(authorId: string) {
  const post = await prisma.post.create({
    data: {
      title: "Untitled Post",
      slug: `post-${nanoid(8)}`,
      content: "",
      authorId,
    },
  });
  
  revalidatePath("/");
  return post;
}

export async function handleCreatePost() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.email !== "admin@livelog.dev") {
    throw new Error("Unauthorized: Personnel access levels insufficient.");
  }

  const post = await prisma.post.create({
    data: {
      title: "Untitled Entry",
      slug: `post-${nanoid(10)}`,
      content: "# New Entry\n\nStart writing...",
      authorId: (session.user as any).id,
    },
  });

  revalidatePath("/");
  redirect(`/editor/${post.id}`);
}

export async function updatePost(id: string, data: { title?: string; content?: string; published?: boolean; isLive?: boolean }) {
  const post = await prisma.post.update({
    where: { id },
    data,
  });
  
  revalidatePath("/");
  revalidatePath(`/post/${post.slug}`);
  revalidatePath(`/editor/${id}`);
  return post;
}

export async function toggleLiveMode(id: string, currentState: boolean) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== "admin@livelog.dev") {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.update({
    where: { id },
    data: { 
      isLive: !currentState,
      lastLiveAt: currentState ? new Date() : undefined
    },
  });

  revalidatePath(`/editor/${id}`);
  revalidatePath("/");
  return post;
}

export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
}

/** Public feed: only published posts, live ones float to the top */
export async function getPublishedPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: [
      { isLive: "desc" },
      { createdAt: "desc" },
    ],
    include: { author: true },
  });
}

export async function handleDeletePost(id: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== "admin@livelog.dev") {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/");
  redirect("/");
}

export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        where: { parentId: null }, // top-level only
        include: {
          author: true,
          replies: {
            include: {
              author: true,
              replies: { include: { author: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
