import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "LiveLog | Real-time Blogging for Developers",
  description: "A personal developer blog platform with a real-time writing mode.",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-neo-bg text-foreground font-mono transition-colors duration-200">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
