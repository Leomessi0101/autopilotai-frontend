import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutopilotAI",
  description: "AI tools for content, email and ads",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
