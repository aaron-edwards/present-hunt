import type { Metadata } from "next";

import { getHunt } from "@/lib/hunt";

import "./globals.css";

export const metadata: Metadata = {
  title: "Present Hunt",
  description: "A playful mobile-first scavenger hunt.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const hunt = getHunt();

  return (
    <html lang="en">
      <body
        style={
          {
            "--color-accent": hunt.theme.accent,
            "--color-accent-soft": hunt.theme.accentSoft,
            "--color-background": hunt.theme.background,
            "--color-surface": hunt.theme.surface,
            "--color-text": hunt.theme.text,
            "--color-muted": hunt.theme.muted,
            "--color-border": hunt.theme.border,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
