import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/containers/Navbar";

export const metadata: Metadata = {
  title: "To Do List",
  description: "codeit sprint assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-nanum santialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
