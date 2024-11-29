import NavBar from "@/components/NavBar";
import "@picocss/pico";
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
      <body>
        <header className="container">
          <NavBar />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
