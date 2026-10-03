import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BitShift Hackathon",
  description: "Build bold. Shift the future."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
