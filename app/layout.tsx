import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TPQ Nurul Iman", template: "%s | TPQ Nurul Iman" },
  description:
    "Sistem informasi TPQ: data santri, pencapaian hafalan dan mengaji, serta pengumuman.",
};

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
