"use client";

import React, { useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";

/* ======================================================
   TYPES
====================================================== */

type ImageData = {
  id: string;
  url: string;
  size: "small" | "medium" | "large";
};

type AIGeneratedSection = {
  html: string;
  data: Record<string, any>;
  images?: ImageData[];
  animations?: boolean;
};

type AIWebsiteData = {
  business_name: string;
  sections: Record<string, AIGeneratedSection>;
  meta?: any;
  seo?: {
    meta_description: string;
    keywords: string[];
  };
};

type Props = {
  username: string;
  content: AIWebsiteData;
  structure: any;
  editMode: boolean;
};

/* ======================================================
   CONSTANTS
====================================================== */

const COLOR_THEMES = [
  { id: "indigo", name: "Indigo", primary: "indigo-500", class: "bg-indigo-500" },
  { id: "emerald", name: "Emerald", primary: "emerald-500", class: "bg-emerald-500" },
  { id: "orange", name: "Orange", primary: "orange-500", class: "bg-orange-500" },
  { id: "purple", name: "Purple", primary: "purple-500", class: "bg-purple-500" },
  { id: "rose", name: "Rose", primary: "rose-500", class: "bg-rose-500" },
];

const SIZE_CLASSES = {
  small: "max-w-sm h-48",
  medium: "max-w-2xl h-64",
  large: "max-w-4xl h-96",
};

function getApiBase() {
  return (
    (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim() ||
    "https://autopilotai-api.onrender.com"
  );
}

/* ======================================================
   PUBLISHING CHECKLIST
====================================================== */

function PublishChecklist({
  content,
  onClose,
}: {
  content: AIWebsiteData;
  onClose: () => void;
}) {
  const hasContactInfo = Boolean(
    content.sections?.contact?.data?.email || 
    content.sections?.contact?.data?.phone
  );
  
  const hasImages = Object.values(content.sections || {}).some(
    (section: any) => section.images && section.images.length > 0
  );
  
  const hasSEO = Boolean(content.seo?.meta_description);
  
  const allComplete = hasContactInfo && hasImages && hasSEO;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {allComplete ? "✅ Ready to Publish!" : "📋 Publishing Checklist"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <ChecklistItem
            completed={hasContactInfo}
            title="Add contact information"
            description="Email, phone, or address"
          />
          <ChecklistItem
            completed={hasImages}
            title="Upload at least one image"
            description="Images increase trust and conversions"
          />
          <ChecklistItem
            completed={hasSEO}
            title="Set meta description"
            description="Helps with Google search results"
          />
        </div>

        <button
          onClick={onClose}
          className={`w-full mt-6 px-6 py-3 rounded-xl font-semibold transition ${
            allComplete
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          {allComplete ? "Publish Now" : "Got it"}
        </button>
      </div>
    </div>
  );
}

function ChecklistItem({
  completed,
  title,
  description,
}: {
  completed: boolean;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/10">
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
          completed ? "bg-green-500" : "bg-gray-700"
        }`}
      >
        {completed && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <div className={`font-medium ${completed ? "text-green-400" : "text-white"}`}>
          {title}
        </div>
        <div className="text-sm text-gray-500 mt-1">{description}</div>
      </div>
    </div>
  );
}

/* ======================================================
   THEME PICKER
====================================================== */

function ThemePicker({
  currentTheme,
  onThemeChange,
}: {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
      <div className="text-sm font-medium text-white mb-3">Color Theme</div>
      <div className="flex gap-2">
        {COLOR_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`relative w-10 h-10 rounded-lg ${theme.class} transition-transform hover:scale-110 ${
              currentTheme === theme.id ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
            }`}
            title={theme.name}
          >
            {currentTheme === theme.id && (
              <svg className="absolute inset-0 m-auto w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   PREVIEW MODE TOGGLE
====================================================== */

function PreviewModeToggle({
  mode,
  onModeChange,
}: {
  mode: "desktop" | "tablet" | "mobile";
  onModeChange: (mode: "desktop" | "tablet" | "mobile") => void;
}) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-2 flex gap-1">
      {[
        { id: "desktop", icon: "💻", label: "Desktop" },
        { id: "tablet", icon: "📱", label: "Tablet" },
        { id: "mobile", icon: "📱", label: "Mobile" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => onModeChange(item.id as any)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === item.id
              ? "bg-indigo-500 text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

/* ======================================================
   CONTENT REWRITER MODAL
====================================================== */

function ContentRewriter({
  originalText,
  onSelect,
  onClose,
  username,
}: {
  originalText: string;
  onSelect: (newText: string) => void;
  onClose: () => void;
  username: string;
}) {
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<"professional" | "casual" | "persuasive">("professional");

  const generateAlternatives = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("autopilot_token");
      const res = await fetch(`${getApiBase()}/api/restaurants/${username}/rewrite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: originalText, tone }),
      });

      const data = await res.json();
      setAlternatives(data.alternatives || []);
    } catch (e) {
      console.error("Rewrite failed:", e);
      setAlternatives([originalText, originalText, originalText]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">✨ Rewrite Content</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="text-sm font-medium text-gray-400 mb-2">Original</div>
          <div className="p-4 bg-white/5 rounded-xl text-white border border-white/10">
            {originalText}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm font-medium text-gray-400 mb-2">Tone</div>
          <div className="flex gap-2">
            {(["professional", "casual", "persuasive"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  tone === t
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {alternatives.length === 0 && (
          <button
            onClick={generateAlternatives}
            disabled={loading}
            className="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Alternatives"}
          </button>
        )}

        {alternatives.length > 0 && (
          <div className="space-y-3">
            {alternatives.map((alt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect(alt);
                  onClose();
                }}
                className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-xl text-left text-white transition"
              >
                <div className="text-xs text-gray-500 mb-1">Option {idx + 1}</div>
                {alt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   IMAGE MANAGEMENT
====================================================== */

function ImageBlock({
  image,
  editMode,
  onResize,
  onRemove,
}: {
  image: ImageData;
  editMode: boolean;
  onResize: (id: string, size: "small" | "medium" | "large") => void;
  onRemove: (id: string) => void;
}) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div
      className={`mx-auto my-8 ${SIZE_CLASSES[image.size]}`}
      onMouseEnter={() => editMode && setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative group">
        <img
          src={image.url}
          alt=""
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />

        {editMode && showControls && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-3">
              <div className="text-xs text-white/70 font-medium text-center">Size</div>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onResize(image.id, s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                      image.size === s
                        ? "bg-indigo-500 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onRemove(image.id)}
                className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUploader({ onUpload, username }: { onUpload: (url: string) => void; username: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
      if (data?.url) onUpload(String(data.url));
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 bg-gray-900/50">
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
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-white font-medium mb-4">
          {uploading ? "Uploading..." : "Upload an image"}
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-medium"
        >
          Choose File
        </button>
      </div>
    </div>
  );
}

/* ======================================================
   EDITABLE SECTION
====================================================== */

function EditableSection({
  sectionKey,
  html,
  data,
  images,
  editMode,
  onUpdate,
  onImagesUpdate,
  username,
  animations,
}: {
  sectionKey: string;
  html: string;
  data: Record<string, any>;
  images: ImageData[];
  editMode: boolean;
  onUpdate: (key: string, newData: Record<string, any>) => void;
  onImagesUpdate: (key: string, images: ImageData[]) => void;
  username: string;
  animations?: boolean;
}) {
  const [localData, setLocalData] = useState(data);
  const [isEditingText, setIsEditingText] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showRewriter, setShowRewriter] = useState(false);
  const [rewriteField, setRewriteField] = useState<string>("");

  const renderHTML = (template: string, values: Record<string, any>) => {
    let result = template;
    Object.keys(values).forEach((key) => {
      const value = values[key];
      const placeholder = `{{${key}}}`;
      if (Array.isArray(value)) {
        result = result.replace(placeholder, value.map((v) => `<p class="mt-4">${v}</p>`).join(""));
      } else {
        result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), String(value));
      }
    });
    return result;
  };

  const handleSave = async () => {
    onUpdate(sectionKey, localData);
    setIsEditingText(false);
  };

  const handleImageResize = (id: string, size: "small" | "medium" | "large") => {
    onImagesUpdate(sectionKey, images.map((img) => (img.id === id ? { ...img, size } : img)));
  };

  const handleImageRemove = (id: string) => {
    onImagesUpdate(sectionKey, images.filter((img) => img.id !== id));
  };

  const handleImageAdd = (url: string) => {
    onImagesUpdate(sectionKey, [...images, { id: `img-${Date.now()}`, url, size: "medium" }]);
    setShowImageUploader(false);
  };

  if (isEditingText) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 my-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-semibold">Edit {sectionKey}</h3>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
              Save
            </button>
            <button onClick={() => setIsEditingText(false)} className="px-5 py-2 bg-gray-700 text-white rounded-lg">
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {Object.keys(localData).map((key) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-400 font-medium">{key}</label>
                <button
                  onClick={() => {
                    setRewriteField(key);
                    setShowRewriter(true);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  ✨ Rewrite
                </button>
              </div>
              {Array.isArray(localData[key]) ? (
                <div className="space-y-2">
                  {localData[key].map((item: any, idx: number) => (
                    <textarea
                      key={idx}
                      value={typeof item === "string" ? item : JSON.stringify(item)}
                      onChange={(e) => {
                        const newArray = [...localData[key]];
                        newArray[idx] = e.target.value;
                        setLocalData({ ...localData, [key]: newArray });
                      }}
                      rows={3}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white"
                    />
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={String(localData[key])}
                  onChange={(e) => setLocalData({ ...localData, [key]: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group my-6 ${animations ? "animate-fadeIn" : ""}`}>
      {editMode && (
        <div className="absolute -top-3 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={() => setIsEditingText(true)}
            className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 text-sm font-medium"
          >
            ✏️ Edit Text
          </button>
          <button
            onClick={() => setShowImageUploader(true)}
            className="px-4 py-2 bg-indigo-500/80 backdrop-blur-md text-white rounded-lg hover:bg-indigo-500 text-sm font-medium"
          >
            + Add Image
          </button>
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: renderHTML(html, localData) }} />

      {images.length > 0 && (
        <div className="space-y-6 mt-8">
          {images.map((img) => (
            <ImageBlock
              key={img.id}
              image={img}
              editMode={editMode}
              onResize={handleImageResize}
              onRemove={handleImageRemove}
            />
          ))}
        </div>
      )}

      {showImageUploader && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-semibold">Add Image</h3>
              <button onClick={() => setShowImageUploader(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ImageUploader onUpload={handleImageAdd} username={username} />
          </div>
        </div>
      )}

      {showRewriter && (
        <ContentRewriter
          originalText={String(localData[rewriteField])}
          onSelect={(newText) => {
            setLocalData({ ...localData, [rewriteField]: newText });
            setShowRewriter(false);
          }}
          onClose={() => setShowRewriter(false)}
          username={username}
        />
      )}
    </div>
  );
}

/* ======================================================
   MAIN RENDERER
====================================================== */

export default function UltimateWebsiteRenderer({ username, content, structure, editMode }: Props) {
  const router = useRouter();
  const [localContent, setLocalContent] = useState(content);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showChecklist, setShowChecklist] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(structure?.theme?.id || "indigo");
  const [animationsEnabled, setAnimationsEnabled] = useState(structure?.animations_enabled !== false);

  const handleSectionUpdate = useCallback((sectionKey: string, newData: Record<string, any>) => {
    setLocalContent((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: { ...prev.sections[sectionKey], data: newData },
      },
    }));
  }, []);

  const handleImagesUpdate = useCallback((sectionKey: string, images: ImageData[]) => {
    setLocalContent((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: { ...prev.sections[sectionKey], images },
      },
    }));
  }, []);

  const sections = structure?.sections || Object.keys(localContent.sections || {});

  const containerClass =
    previewMode === "mobile"
      ? "max-w-sm mx-auto"
      : previewMode === "tablet"
      ? "max-w-2xl mx-auto"
      : "w-full";

  return (
    <main className="min-h-screen bg-black">
      {/* Edit Toolbar */}
      {editMode && (
        <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-white">🎨 Edit Mode</div>
              <div className="h-4 w-px bg-gray-700" />
              <PreviewModeToggle mode={previewMode} onModeChange={setPreviewMode} />
            </div>

            <div className="flex items-center gap-3">
              <ThemePicker currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
              <div className="h-4 w-px bg-gray-700" />
              <button
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  animationsEnabled ? "bg-indigo-500 text-white" : "bg-white/10 text-gray-400"
                }`}
              >
                ✨ Animations
              </button>
              <button
                onClick={() => setShowChecklist(true)}
                className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 text-sm font-medium"
              >
                📋 Publish
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm font-medium"
              >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={containerClass}>
        {sections.map((sectionKey: string) => {
          const section = localContent.sections[sectionKey];
          if (!section || !section.html) return null;

          return (
            <EditableSection
              key={sectionKey}
              sectionKey={sectionKey}
              html={section.html}
              data={section.data || {}}
              images={section.images || []}
              editMode={editMode}
              onUpdate={handleSectionUpdate}
              onImagesUpdate={handleImagesUpdate}
              username={username}
              animations={animationsEnabled}
            />
          );
        })}
      </div>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-gray-500 border-t border-gray-800 mt-20">
        © {new Date().getFullYear()} {localContent.business_name || username}
      </footer>

      {/* Modals */}
      {showChecklist && <PublishChecklist content={localContent} onClose={() => setShowChecklist(false)} />}

      {/* Animation Styles */}
      {animationsEnabled && (
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
        `}</style>
      )}
    </main>
  );
}