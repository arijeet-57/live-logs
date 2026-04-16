import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    // ── Google OAuth ──────────────────────────────────────────────────────────
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // ── GitHub OAuth ─────────────────────────────────────────────────────────
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),

    // ── Email Magic Link ──────────────────────────────────────────────────────
    // In development (or when SMTP not configured), the magic link is printed
    // to the server console so you can test without email setup.
    EmailProvider({
      server: { host: "localhost", port: 25 }, // overridden by sendVerificationRequest
      from: process.env.EMAIL_FROM || "LIVE_LOG <noreply@livelog.dev>",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        if (!process.env.EMAIL_SERVER_HOST) {
          // Dev / no-SMTP fallback — log magic link to terminal
          console.log("\n╔═══════════════════════════════════════════╗");
          console.log("║           MAGIC LINK (dev mode)           ║");
          console.log(`║  To: ${email.padEnd(37)}║`);
          console.log("╠═══════════════════════════════════════════╣");
          console.log(`  ${url}`);
          console.log("╚═══════════════════════════════════════════╝\n");
          return;
        }

        // Production — send via SMTP (requires nodemailer: npm i nodemailer)
        const { createTransport } = await import("nodemailer");
        const transport = createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT || "587"),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transport.sendMail({
          to: email,
          from: process.env.EMAIL_FROM || "LIVE_LOG <noreply@livelog.dev>",
          subject: "Sign in to LIVE_LOG",
          text: `Sign in to LIVE_LOG\n\nClick this link to authenticate:\n${url}\n\nThis link expires in 24 hours and can only be used once.`,
          html: `
            <div style="font-family:monospace;max-width:480px;margin:0 auto;padding:2rem;background:#09090b;color:#fafafa;border:2px solid #27272a;">
              <h2 style="font-size:1.25rem;font-weight:900;letter-spacing:-0.05em;text-transform:uppercase;margin:0 0 1.5rem;">LIVE_LOG ACCESS</h2>
              <p style="font-size:0.75rem;opacity:0.6;margin:0 0 1.5rem;">Click the link below to sign in. It expires in 24 hours.</p>
              <a href="${url}" style="display:inline-block;font-family:monospace;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;padding:0.75rem 1.5rem;border:2px solid #3f3f46;background:#18181b;color:#fafafa;text-decoration:none;">
                AUTHENTICATE →
              </a>
              <p style="font-size:0.625rem;opacity:0.4;margin:1.5rem 0 0;text-transform:uppercase;">LIVE_LOG SYSTEM_AUTH_v1.0</p>
            </div>`,
        });
      },
    }),

    // ── Admin Credentials (single-user owner) ─────────────────────────────────
    CredentialsProvider({
      id: "credentials",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin123"
        ) {
          let user = await prisma.user.findUnique({
            where: { email: "admin@livelog.dev" },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name: "Admin",
                email: "admin@livelog.dev",
                image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=admin",
              },
            });
          }

          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      },
    }),
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
