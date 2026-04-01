import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutopilotAI — AI Website Builder for Local Business",
  description:
    "Get a professional website in 60 seconds. AutopilotAI writes your copy, designs your layout, and publishes your site with a custom domain — for $10/month. No code. No designer. Free to start.",
  keywords: [
    "AI website builder",
    "website builder for local business",
    "AI website generator",
    "website in 60 seconds",
    "small business website",
    "local business website builder",
    "no code website builder",
    "cheap website builder",
  ],
  openGraph: {
    title: "AutopilotAI — AI Website Builder for Local Business",
    description:
      "Type two sentences about your business. AutopilotAI builds a professional, SEO-ready website in under 60 seconds. Free to start, $10/month to go live.",
    type: "website",
    url: "https://autopilotai.dev",
    siteName: "AutopilotAI",
    images: [
      {
        url: "https://autopilotai.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutopilotAI — AI Website Builder for Local Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutopilotAI — AI Website Builder for Local Business",
    description:
      "Type two sentences about your business. Get a professional website in 60 seconds. Free to start, $10/month to publish.",
    images: ["https://autopilotai.dev/og-image.png"],
  },
  metadataBase: new URL("https://autopilotai.dev"),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

      </body>
    </html>
  );
}
