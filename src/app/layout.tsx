import NavBar from "@/components/NavBar";
import "@picocss/pico";
import type { Metadata } from "next";
import "./global.css";

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
        <main className="container main">{children}</main>
        <footer className="container footer">
          <hr />
          estifanos
        </footer>
      </body>
    </html>
  );
}
