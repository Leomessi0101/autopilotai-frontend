"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ======================================================
   TYPES
====================================================== */

type ImageData = {
  id: string;
  url: string;
  size: "small" | "medium" | "large";
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
  userPlan?: string;
};

/* ======================================================
   API & CONSTANTS
====================================================== */

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://autopilotai-api.onrender.com";
}

const THEME_OPTIONS = [
  { 
    id: "midnight_purple", 
    name: "Midnight Purple",
    preview: "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700"
  },
  { 
    id: "ocean_deep", 
    name: "Ocean Deep",
    preview: "bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-700"
  },
  { 
    id: "sunset_fire", 
    name: "Sunset Fire",
    preview: "bg-gradient-to-r from-orange-500 via-rose-600 to-pink-600"
  },
  { 
    id: "emerald_forest", 
    name: "Emerald Forest",
    preview: "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600"
  },
  { 
    id: "slate_pro", 
    name: "Slate Pro",
    preview: "bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900"
  },
];

/* ======================================================
   INLINE EDITABLE TEXT
====================================================== */

function InlineEdit({
  value,
  onChange,
  multiline = false,
  className = "",
}: {
  value: string;
  onChange: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
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
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  return (
    <span
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={() => !isEditing && setIsEditing(true)}
      onBlur={handleSave}
      onInput={(e) => setLocalValue(e.currentTarget.textContent || "")}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          handleSave();
        }
        if (e.key === "Escape") {
          setLocalValue(value);
          setIsEditing(false);
        }
      }}
      className={`${className} ${
        isEditing
          ? "outline outline-2 outline-indigo-500 outline-offset-4 rounded-lg px-2 bg-indigo-500/10"
          : "cursor-text hover:bg-white/5 rounded-lg px-1 transition-all"
      }`}
    >
      {localValue}
    </span>
  );
}

/* ======================================================
   IMAGE MANAGER
====================================================== */

function ImageManager({
  images,
  onImagesUpdate,
  username,
  sectionKey,
}: {
  images: ImageData[];
  onImagesUpdate: (images: ImageData[]) => void;
  username: string;
  sectionKey: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
          size: "medium",
        };
        onImagesUpdate([...images, newImage]);
        setShowUploader(false);
      }
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function resizeImage(id: string, size: "small" | "medium" | "large") {
    onImagesUpdate(images.map((img) => (img.id === id ? { ...img, size } : img)));
  }

  function removeImage(id: string) {
    onImagesUpdate(images.filter((img) => img.id !== id));
  }

  const sizeClasses = {
    small: "max-w-md h-48",
    medium: "max-w-3xl h-80",
    large: "max-w-6xl h-96",
  };

  return (
    <div className="my-12 space-y-6">
      {/* Existing images */}
      {images.map((img) => (
        <div key={img.id} className={`mx-auto ${sizeClasses[img.size]} group relative`}>
          <img
            src={img.url}
            alt=""
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
          
          {/* Controls on hover */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3">
              <div className="text-xs text-white/70 font-medium text-center">Image Size</div>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => resizeImage(img.id, s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                      img.size === s
                        ? "bg-indigo-500 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => removeImage(img.id)}
                className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add image button */}
      <div className="text-center">
        <button
          onClick={() => setShowUploader(true)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-medium transition-all hover:scale-105"
        >
          + Add Image
        </button>
      </div>

      {/* Upload modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add Image</h3>
              <button
                onClick={() => setShowUploader(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

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

            <div
              className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition"
              onClick={() => inputRef.current?.click()}
            >
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white font-medium mb-2">
                {uploading ? "Uploading..." : "Click to upload"}
              </p>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   SECTION COMPONENT
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Replace {{placeholders}} with editable text
  useEffect(() => {
    if (!containerRef.current || !editMode) return;

    const container = containerRef.current;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent?.trim()) {
        textNodes.push(node as Text);
      }
    }

    // Make matching text nodes editable
    textNodes.forEach((textNode) => {
      const parent = textNode.parentElement;
      if (!parent) return;

      const text = textNode.textContent?.trim() || "";

      // Find matching data key
      const matchingKey = Object.keys(localData).find(
        (key) => String(localData[key]).trim() === text
      );

      if (matchingKey) {
        const span = document.createElement("span");
        span.textContent = text;
        span.className = "cursor-text hover:bg-white/5 rounded-lg px-1 transition-all inline-block";
        span.setAttribute("data-key", matchingKey);

        let isEditing = false;

        span.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!isEditing) {
            isEditing = true;
            span.contentEditable = "true";
            span.focus();
            span.classList.add("outline", "outline-2", "outline-indigo-500", "outline-offset-4", "bg-indigo-500/10");
            
            // Select all
            const range = document.createRange();
            range.selectNodeContents(span);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        });

        span.addEventListener("blur", () => {
          isEditing = false;
          span.contentEditable = "false";
          span.classList.remove("outline", "outline-2", "outline-indigo-500", "outline-offset-4", "bg-indigo-500/10");
          
          const newValue = span.textContent || "";
          if (newValue !== localData[matchingKey]) {
            const updated = { ...localData, [matchingKey]: newValue };
            setLocalData(updated);
            onDataUpdate(updated);
          }
        });

        span.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            span.blur();
          }
          if (e.key === "Escape") {
            span.textContent = String(localData[matchingKey]);
            span.blur();
          }
        });

        parent.replaceChild(span, textNode);
      }
    });
  }, [section.html, editMode, localData]);

  // Render HTML with placeholders replaced
  const renderHTML = () => {
    let html = section.html;
    Object.keys(localData).forEach((key) => {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      html = html.replace(placeholder, String(localData[key]));
    });
    return html;
  };

  return (
    <div>
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: renderHTML() }}
        className="prose-headings:font-bold prose-p:leading-relaxed max-w-none"
      />

      {editMode && (
        <ImageManager
          images={section.images || []}
          onImagesUpdate={onImagesUpdate}
          username={username}
          sectionKey={sectionKey}
        />
      )}
    </div>
  );
}

/* ======================================================
   FLOATING TOOLBAR
====================================================== */

function FloatingToolbar({
  userPlan,
  currentTheme,
  onThemeChange,
  onPublish,
  onExit,
  saving,
}: {
  userPlan: string;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  onPublish: () => void;
  onExit: () => void;
  saving: boolean;
}) {
  const [showThemes, setShowThemes] = useState(false);
  const isPaid = userPlan === "starter" || userPlan === "pro";

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900/90 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl px-8 py-4 flex items-center gap-6">
        {/* Save status */}
        <div className={`text-sm font-medium ${saving ? "text-indigo-400" : "text-green-400"}`}>
          {saving ? "💾 Saving..." : "✓ Saved"}
        </div>

        <div className="h-6 w-px bg-white/20" />

        {/* Theme picker */}
        <div className="relative">
          <button
            onClick={() => setShowThemes(!showThemes)}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition flex items-center gap-2"
          >
            🎨 Theme
          </button>

          {showThemes && (
            <div className="absolute bottom-full left-0 mb-3 bg-gray-900/95 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-2xl min-w-[240px]">
              <div className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                Color Palette
              </div>
              <div className="space-y-2">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id);
                      setShowThemes(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition ${
                      currentTheme === theme.id ? "bg-white/10 ring-2 ring-indigo-500" : ""
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${theme.preview} shadow-lg`} />
                    <span className="text-white text-sm font-medium">{theme.name}</span>
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
            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            ✓ Publish
          </button>
        ) : (
          <div
            className="px-6 py-2.5 bg-gray-700/50 text-gray-400 rounded-xl font-medium cursor-not-allowed"
            title="Upgrade to Pro to publish"
          >
            🔒 Publish (Pro Only)
          </div>
        )}

        <div className="h-6 w-px bg-white/20" />

        {/* Exit */}
        <button
          onClick={onExit}
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition"
        >
          ← Exit
        </button>

        {/* Help tip */}
        <div className="text-xs text-gray-400 ml-2">
          💡 Click any text to edit
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   MAIN RENDERER
====================================================== */

export default function AIHTMLWebsiteRenderer({
  username,
  content,
  structure,
  editMode,
  userPlan = "free",
}: Props) {
  const router = useRouter();
  const [localContent, setLocalContent] = useState(content);
  const [currentTheme, setCurrentTheme] = useState(structure?.palette_key || "midnight_purple");
  const [saving, setSaving] = useState(false);

  const handleDataUpdate = (sectionKey: string, data: Record<string, any>) => {
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
    }, 1500);
  };

  const handleImagesUpdate = (sectionKey: string, images: ImageData[]) => {
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
  };

  const handlePublish = () => {
    alert("Publishing coming soon! Your site will be live at your custom domain.");
  };

  const sections = structure?.sections || Object.keys(localContent.sections || {});

  return (
    <div className="min-h-screen bg-black">
      {/* Sections */}
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

      {/* Floating toolbar (edit mode only) */}
      {editMode && (
        <FloatingToolbar
          userPlan={userPlan}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onPublish={handlePublish}
          onExit={() => router.push("/dashboard")}
          saving={saving}
        />
      )}
    </div>
  );
}