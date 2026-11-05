import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "./globals.css";
import { themeInitScript } from "@/components/theme/themeScript";

export const metadata: Metadata = {
  title: { default: "TPQ Nurul Iman", template: "%s | TPQ Nurul Iman" },
  description:
    "Sistem informasi TPQ: data santri, pencapaian hafalan dan mengaji, serta pengumuman.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#047857" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1512" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-page text-ink antialiased">{children}</body>
    </html>
  );
}