import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "placeholder",
      clientSecret: process.env.GITHUB_SECRET || "placeholder",
    }),
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hardcoded admin for "LiveLog" single-user owner
        if (credentials?.username === "admin" && credentials?.password === "admin123") {
          // Check if admin user exists in DB, if not, find or create.
          let user = await prisma.user.findUnique({
            where: { email: "admin@livelog.dev" }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name: "Admin",
                email: "admin@livelog.dev",
                image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=admin"
              }
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
