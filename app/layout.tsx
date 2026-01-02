import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutopilotAI",
  description: "AI tools for creators, entrepreneurs and automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-core text-foreground antialiased">
        {/* Animated Background Glow */}
        <div className="app-background">
          <div className="app-gradient" />
          <div className="app-gradient delay" />
        </div>

        {/* App Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
