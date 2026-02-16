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
  theme = "pro_light",
  industry = "tech",
  canEdit = false,
  isPublished = false,
  editUrl,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || !html) return;

    // Clear previous content
    containerRef.current.innerHTML = "";

    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Move all content from temp div to actual container
    while (tempDiv.firstChild) {
      containerRef.current.appendChild(tempDiv.firstChild);
    }

    // Execute any scripts that were in the HTML
    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    console.log("✅ Website rendered:", { username, theme, industry });
  }, [html, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Edit mode banner */}
      {canEdit && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="font-semibold">Edit Mode Active</span>
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

      {/* Website content */}
      <div
        ref={containerRef}
        className={canEdit ? "pt-20" : ""}
        // Styles will be injected by Tailwind from the HTML content
      />

      {/* Footer info (non-edit mode) */}
      {!canEdit && !isPublished && (
        <div className="fixed bottom-4 right-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 px-4 py-3 rounded-lg text-sm max-w-xs">
          <p className="font-semibold mb-1">Website Draft</p>
          <p className="text-xs opacity-90">This website is not published yet. Only you can see it.</p>
        </div>
      )}
    </>
  );
}