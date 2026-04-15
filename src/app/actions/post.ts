"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid"; // I need to install nanoid or use a custom slug generator

export async function createPost(authorId: string) {
  const post = await prisma.post.create({
    data: {
      title: "Untitled Post",
      slug: `untitled-${Math.random().toString(36).substring(2, 7)}`,
      content: "",
      authorId,
    },
  });
  
  revalidatePath("/");
  return post;
}

export async function updatePost(id: string, data: { title?: string; content?: string; published?: boolean; isLive?: boolean }) {
  const post = await prisma.post.update({
    where: { id },
    data,
  });
  
  revalidatePath("/");
  revalidatePath(`/post/${post.slug}`);
  return post;
}

export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
}

export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    include: { author: true, comments: { include: { author: true } } },
  });
}
