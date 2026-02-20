"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  username: string;
  html: string;
  metadata?: Record<string, any>;
  businessName?: string;
  theme?: string;
  industry?: string;
  canEdit?: boolean;
  isPublished?: boolean;
  editUrl?: string;
};

export default function AIHTMLWebsiteRenderer({
  username,
  html,
  metadata,
  businessName,
  theme,
  industry,
  canEdit = false,
  isPublished = false,
  editUrl,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !iframeRef.current || !html) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Write a completely isolated HTML document into the iframe.
    // This is the ONLY way to guarantee Next.js global CSS (the purple source)
    // cannot reach the generated website's styles.
    const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* Hard reset — nothing from the parent page leaks in */
    html, body {
      margin: 0;
      padding: 0;
      border: 0;
      min-height: 100vh;
    }
    /* Guarantee links are NEVER purple unless our theme sets them */
    a { color: inherit; text-decoration: none; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

    doc.open();
    doc.write(fullDoc);
    doc.close();

    console.log("✅ Website rendered in isolated iframe:", { username, theme, industry });
  }, [html, mounted, username, theme, industry]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Edit mode banner — lives in Next.js, above the iframe */}
      {canEdit && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="font-semibold text-sm">Edit Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/dashboard/websites/${username}`}
              className="text-sm px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded transition"
            >
              Full Editor
            </a>
            <a
              href={`/r/${username}`}
              className="text-sm px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded transition"
            >
              Exit Edit
            </a>
          </div>
        </div>
      )}

      {/* 
        The iframe is the critical fix.
        It creates a completely separate browsing context — Next.js CSS,
        Tailwind utilities, global resets: none of them can cross this boundary.
        The generated website's own <style> block wins every cascade battle.
      */}
      <iframe
        ref={iframeRef}
        title={`${businessName || username} website`}
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block",
          marginTop: canEdit ? "52px" : "0",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />

      {/* Draft badge — lives in Next.js above the iframe */}
      {!canEdit && !isPublished && (
        <div className="fixed bottom-4 right-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 px-4 py-3 rounded-lg text-sm max-w-xs z-50">
          <p className="font-semibold mb-1">Website Draft</p>
          <p className="text-xs opacity-90">Not published yet. Only you can see this.</p>
        </div>
      )}
    </>
  );
}