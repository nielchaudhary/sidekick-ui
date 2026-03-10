import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark-dimmed.min.css";
import "katex/dist/katex.min.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sidekick",
  description:
    "The thinking partner that remembers. For operators who make decisions under pressure.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
      <body suppressHydrationWarning className={`${inter.variable} antialiased bg-black min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
