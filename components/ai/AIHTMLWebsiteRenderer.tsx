"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ======================================================
   TYPES
====================================================== */

type ImageData = {
  id: string;
  url: string;
  position: "top" | "middle" | "bottom";
};

type SectionData = {
  html: string;
  data: Record<string, any>;
  images?: ImageData[];
};

type WebsiteContent = {
  business_name: string;
  sections: Record<string, SectionData>;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
};

type Props = {
  username: string;
  content: WebsiteContent;
  structure: any;
  editMode: boolean;
  userPlan: string;
};

/* ======================================================
   UTILS
====================================================== */

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://autopilotai-api.onrender.com";
}

const PALETTE_OPTIONS = [
  { id: "purple_dusk", name: "Purple Dusk", preview: "from-purple-600 to-indigo-600" },
  { id: "ocean_breeze", name: "Ocean Breeze", preview: "from-cyan-500 to-blue-600" },
  { id: "sunset_glow", name: "Sunset Glow", preview: "from-orange-500 to-pink-600" },
  { id: "forest_mist", name: "Forest Mist", preview: "from-emerald-600 to-teal-600" },
  { id: "monochrome_pro", name: "Monochrome", preview: "from-gray-800 to-gray-900" },
];

/* ======================================================
   INLINE EDITABLE TEXT
====================================================== */

function EditableText({
  value,
  onChange,
  editMode,
  className = "",
  multiline = false,
}: {
  value: string;
  onChange: (newValue: string) => void;
  editMode: boolean;
  className?: string;
  multiline?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  if (!editMode) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={() => !isEditing && setIsEditing(true)}
      onBlur={handleBlur}
      onInput={(e) => setLocalValue(e.currentTarget.textContent || "")}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          handleBlur();
        }
        if (e.key === "Escape") {
          setLocalValue(value);
          setIsEditing(false);
        }
      }}
      className={`${className} ${
        isEditing
          ? "outline outline-2 outline-indigo-500 outline-offset-2 rounded px-2 py-1 bg-indigo-500/10"
          : editMode
          ? "cursor-pointer hover:bg-white/5 rounded px-1 transition-colors"
          : ""
      }`}
      style={{ minWidth: isEditing ? "100px" : "auto" }}
    >
      {localValue}
    </span>
  );
}

/* ======================================================
   IMAGE MANAGER
====================================================== */

function ImageZone({
  sectionKey,
  images,
  onImagesUpdate,
  editMode,
  username,
  position,
}: {
  sectionKey: string;
  images: ImageData[];
  onImagesUpdate: (images: ImageData[]) => void;
  editMode: boolean;
  username: string;
  position: "top" | "middle" | "bottom";
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const positionImages = images.filter((img) => img.position === position);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const token = localStorage.getItem("autopilot_token");
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${getApiBase()}/api/restaurants/${username}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      if (data?.url) {
        const newImage: ImageData = {
          id: `img-${Date.now()}`,
          url: String(data.url),
          position,
        };
        onImagesUpdate([...images, newImage]);
      }
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(id: string) {
    onImagesUpdate(images.filter((img) => img.id !== id));
  }

  if (!editMode && positionImages.length === 0) {
    return null;
  }

  return (
    <div className={`my-8 ${position === "middle" ? "-my-16 relative z-20" : ""}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f);
        }}
      />

      {positionImages.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {positionImages.map((img) => (
            <div key={img.id} className="group relative">
              <img
                src={img.url}
                alt=""
                className="w-full h-64 object-cover rounded-3xl shadow-2xl"
              />
              {editMode && (
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {editMode && (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-medium transition-all hover:scale-105 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : `+ Add Image${position !== "middle" ? ` (${position})` : ""}`}
        </button>
      )}
    </div>
  );
}

/* ======================================================
   SECTION RENDERER
====================================================== */

function Section({
  sectionKey,
  section,
  editMode,
  onDataUpdate,
  onImagesUpdate,
  username,
}: {
  sectionKey: string;
  section: SectionData;
  editMode: boolean;
  onDataUpdate: (data: Record<string, any>) => void;
  onImagesUpdate: (images: ImageData[]) => void;
  username: string;
}) {
  const [localData, setLocalData] = useState(section.data || {});

  // Replace {{placeholders}} with editable components
  const renderHTML = () => {
    let html = section.html;

    Object.keys(localData).forEach((key) => {
      const value = localData[key];
      const placeholder = `{{${key}}}`;

      if (html.includes(placeholder)) {
        // Replace with a temporary unique marker
        const markerId = `EDITABLE_${key}_${Math.random().toString(36).slice(2)}`;
        html = html.replace(placeholder, markerId);

        // After rendering, we'll inject the React component
        setTimeout(() => {
          const elements = document.querySelectorAll(`[data-marker="${markerId}"]`);
          elements.forEach((el) => {
            el.textContent = String(value);
          });
        }, 0);
      }
    });

    return html;
  };

  const handleDataChange = (key: string, newValue: string) => {
    const updated = { ...localData, [key]: newValue };
    setLocalData(updated);
    onDataUpdate(updated);
  };

  // Parse HTML and inject editable text
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all text nodes and make them editable
    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent?.trim()) {
        textNodes.push(node as Text);
      }
    }

    // Make each text node editable
    textNodes.forEach((textNode) => {
      if (!textNode.parentElement) return;

      const parent = textNode.parentElement;
      const text = textNode.textContent || "";

      // Check if this text matches any data value
      const matchingKey = Object.keys(localData).find(
        (key) => String(localData[key]) === text.trim()
      );

      if (matchingKey && editMode) {
        const span = document.createElement("span");
        span.textContent = text;
        span.className = "cursor-pointer hover:bg-white/5 rounded px-1 transition-colors";
        span.setAttribute("data-editable-key", matchingKey);

        span.addEventListener("click", () => {
          span.contentEditable = "true";
          span.focus();
          span.classList.add("outline", "outline-2", "outline-indigo-500", "bg-indigo-500/10");
        });

        span.addEventListener("blur", () => {
          span.contentEditable = "false";
          span.classList.remove("outline", "outline-2", "outline-indigo-500", "bg-indigo-500/10");
          handleDataChange(matchingKey, span.textContent || "");
        });

        parent.replaceChild(span, textNode);
      }
    });
  }, [section.html, editMode]);

  return (
    <div className="relative">
      {/* Top images */}
      <ImageZone
        sectionKey={sectionKey}
        images={section.images || []}
        onImagesUpdate={onImagesUpdate}
        editMode={editMode}
        username={username}
        position="top"
      />

      {/* Section content */}
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: renderHTML() }}
        className="prose-headings:font-bold prose-p:leading-relaxed max-w-none"
      />

      {/* Middle images (overlapping) */}
      <ImageZone
        sectionKey={sectionKey}
        images={section.images || []}
        onImagesUpdate={onImagesUpdate}
        editMode={editMode}
        username={username}
        position="middle"
      />

      {/* Bottom images */}
      <ImageZone
        sectionKey={sectionKey}
        images={section.images || []}
        onImagesUpdate={onImagesUpdate}
        editMode={editMode}
        username={username}
        position="bottom"
      />
    </div>
  );
}

/* ======================================================
   FLOATING TOOLBAR
====================================================== */

function FloatingToolbar({
  userPlan,
  onPublish,
  onThemeChange,
  currentTheme,
  onExit,
}: {
  userPlan: string;
  onPublish: () => void;
  onThemeChange: (theme: string) => void;
  currentTheme: string;
  onExit: () => void;
}) {
  const [showThemes, setShowThemes] = useState(false);
  const isPaid = userPlan === "starter" || userPlan === "pro";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
        {/* Theme picker */}
        <div className="relative">
          <button
            onClick={() => setShowThemes(!showThemes)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition flex items-center gap-2"
          >
            🎨 Theme
          </button>

          {showThemes && (
            <div className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-white/20 rounded-xl p-3 shadow-2xl min-w-[200px]">
              <div className="text-xs text-gray-400 mb-2 font-medium">Color Palette</div>
              <div className="space-y-2">
                {PALETTE_OPTIONS.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => {
                      onThemeChange(palette.id);
                      setShowThemes(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition ${
                      currentTheme === palette.id ? "bg-white/10" : ""
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${palette.preview}`} />
                    <span className="text-white text-sm font-medium">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Publish */}
        {isPaid ? (
          <button
            onClick={onPublish}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            ✓ Publish
          </button>
        ) : (
          <div className="px-6 py-2 bg-gray-700/50 text-gray-400 rounded-xl font-medium cursor-not-allowed" title="Upgrade to publish">
            🔒 Publish (Pro)
          </div>
        )}

        {/* Exit */}
        <button
          onClick={onExit}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition"
        >
          ← Exit
        </button>

        {/* Help */}
        <div className="text-xs text-gray-400 ml-2">
          Click any text to edit
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   MAIN RENDERER
====================================================== */

export default function PremiumWebsiteRenderer({
  username,
  content,
  structure,
  editMode,
  userPlan = "free",
}: Props) {
  const router = useRouter();
  const [localContent, setLocalContent] = useState(content);
  const [currentTheme, setCurrentTheme] = useState(structure?.palette_name || "purple_dusk");
  const [saving, setSaving] = useState(false);

  const handleDataUpdate = useCallback(
    (sectionKey: string, data: Record<string, any>) => {
      setLocalContent((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections[sectionKey],
            data,
          },
        },
      }));

      // Auto-save
      setSaving(true);
      setTimeout(async () => {
        try {
          const token = localStorage.getItem("autopilot_token");
          await fetch(`${getApiBase()}/api/restaurants/${username}/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(localContent),
          });
        } catch (e) {
          console.error("Save failed:", e);
        }
        setSaving(false);
      }, 1000);
    },
    [localContent, username]
  );

  const handleImagesUpdate = useCallback(
    (sectionKey: string, images: ImageData[]) => {
      setLocalContent((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections[sectionKey],
            images,
          },
        },
      }));
    },
    []
  );

  const handlePublish = () => {
    alert("Publishing feature coming soon!");
  };

  const sections = structure?.sections || Object.keys(localContent.sections || {});

  return (
    <div className="min-h-screen bg-black">
      {/* Edit mode indicator */}
      {editMode && (
        <div className="fixed top-6 left-6 z-40 px-4 py-2 bg-indigo-500/20 border border-indigo-500/50 rounded-full text-indigo-300 text-sm font-medium backdrop-blur-sm">
          {saving ? "💾 Saving..." : "✏️ Edit Mode"}
        </div>
      )}

      {/* Render sections */}
      {sections.map((sectionKey: string) => {
        const section = localContent.sections[sectionKey];
        if (!section?.html) return null;

        return (
          <Section
            key={sectionKey}
            sectionKey={sectionKey}
            section={section}
            editMode={editMode}
            onDataUpdate={(data) => handleDataUpdate(sectionKey, data)}
            onImagesUpdate={(images) => handleImagesUpdate(sectionKey, images)}
            username={username}
          />
        );
      })}

      {/* Floating toolbar */}
      {editMode && (
        <FloatingToolbar
          userPlan={userPlan}
          onPublish={handlePublish}
          onThemeChange={setCurrentTheme}
          currentTheme={currentTheme}
          onExit={() => router.push("/dashboard")}
        />
      )}
    </div>
  );
}