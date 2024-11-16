import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holiday Recipe Finder",
  description: "Discover and share holiday recipes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
