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
  seo?: any;
};

type Props = {
  username: string;
  content: WebsiteContent;
  structure: any;
  editMode: boolean;
  userPlan?: string;
  isPublished?: boolean;
};

/* ======================================================
   API
====================================================== */

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://autopilotai-api.onrender.com";
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
      {images.map((img) => (
        <div key={img.id} className={`mx-auto ${sizeClasses[img.size]} group relative`}>
          <img src={img.url} alt="" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
          
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3">
              <div className="text-xs text-white/70 font-medium text-center">Size</div>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => resizeImage(img.id, s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                      img.size === s ? "bg-indigo-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={() => removeImage(img.id)} className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 text-sm font-medium">
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center">
        <button onClick={() => setShowUploader(true)} className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-medium transition-all hover:scale-105">
          + Add Image
        </button>
      </div>

      {showUploader && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add Image</h3>
              <button onClick={() => setShowUploader(false)} className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />

            <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition" onClick={() => inputRef.current?.click()}>
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white font-medium mb-2">{uploading ? "Uploading..." : "Click to upload"}</p>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   SECTION
====================================================== */

function Section({ sectionKey, section, editMode, onDataUpdate, onImagesUpdate, username }: {
  sectionKey: string; section: SectionData; editMode: boolean;
  onDataUpdate: (data: Record<string, any>) => void;
  onImagesUpdate: (images: ImageData[]) => void;
  username: string;
}) {
  const [localData, setLocalData] = useState(section.data || {});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !editMode) return;

    const container = containerRef.current;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent?.trim()) textNodes.push(node as Text);
    }

    textNodes.forEach((textNode) => {
      const parent = textNode.parentElement;
      if (!parent) return;

      const text = textNode.textContent?.trim() || "";
      const matchingKey = Object.keys(localData).find((key) => String(localData[key]).trim() === text);

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
          if (e.key === "Enter") { e.preventDefault(); span.blur(); }
          if (e.key === "Escape") { span.textContent = String(localData[matchingKey]); span.blur(); }
        });

        parent.replaceChild(span, textNode);
      }
    });
  }, [section.html, editMode, localData]);

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
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: renderHTML() }} className="prose-headings:font-bold prose-p:leading-relaxed max-w-none" />
      {editMode && <ImageManager images={section.images || []} onImagesUpdate={onImagesUpdate} username={username} sectionKey={sectionKey} />}
    </div>
  );
}

/* ======================================================
   TOOLBAR
====================================================== */

function Toolbar({ userPlan, onSave, onUndo, onPublish, onUnpublish, onExit, saving, hasChanges, isPublished }: {
  userPlan: string; onSave: () => void; onUndo: () => void; onPublish: () => void; onUnpublish: () => void; onExit: () => void; saving: boolean; hasChanges: boolean; isPublished: boolean;
}) {
  const isPaid = userPlan === "starter" || userPlan === "pro";

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900/90 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl px-8 py-4 flex items-center gap-4">
        <div className={`text-sm font-medium ${saving ? "text-indigo-400" : hasChanges ? "text-amber-400" : "text-green-400"}`}>
          {saving ? "💾 Saving..." : hasChanges ? "● Unsaved" : "✓ Saved"}
        </div>

        <div className="h-6 w-px bg-white/20" />

        {hasChanges && (
          <>
            <button onClick={onSave} disabled={saving} className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white font-medium transition disabled:opacity-50">
              Save
            </button>
            <button onClick={onUndo} disabled={saving} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition disabled:opacity-50">
              Undo
            </button>
            <div className="h-6 w-px bg-white/20" />
          </>
        )}

        {isPaid ? (
          isPublished ? (
            <button onClick={onUnpublish} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all">
              📤 Unpublish
            </button>
          ) : (
            <button onClick={onPublish} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg">
              ✓ Publish
            </button>
          )
        ) : (
          <div className="px-6 py-2.5 bg-gray-700/50 text-gray-400 rounded-xl font-medium cursor-not-allowed" title="Upgrade to publish">
            🔒 Publish (Pro Only)
          </div>
        )}

        <div className="h-6 w-px bg-white/20" />

        <button onClick={onExit} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition">
          ← Exit
        </button>

        <div className="text-xs text-gray-400 ml-2">💡 Click text to edit</div>
      </div>
    </div>
  );
}

/* ======================================================
   MAIN RENDERER
====================================================== */

export default function AIHTMLWebsiteRenderer({ username, content, structure, editMode, userPlan = "free", isPublished: initialPublished = false }: Props) {
  const router = useRouter();
  const [localContent, setLocalContent] = useState(content);
  const [savedContent, setSavedContent] = useState(content);
  const [saving, setSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(initialPublished);

  const hasChanges = JSON.stringify(localContent) !== JSON.stringify(savedContent);

  const handleDataUpdate = (sectionKey: string, data: Record<string, any>) => {
    setLocalContent((prev) => ({
      ...prev,
      sections: { ...prev.sections, [sectionKey]: { ...prev.sections[sectionKey], data } },
    }));
  };

  const handleImagesUpdate = (sectionKey: string, images: ImageData[]) => {
    setLocalContent((prev) => ({
      ...prev,
      sections: { ...prev.sections, [sectionKey]: { ...prev.sections[sectionKey], images } },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("autopilot_token");
      const res = await fetch(`${getApiBase()}/api/restaurants/${username}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(localContent),
      });
      if (res.ok) {
        setSavedContent(localContent);
        alert("✓ Saved successfully!");
      }
    } catch (e) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleUndo = () => {
    setLocalContent(savedContent);
  };

  const handlePublish = async () => {
    const token = localStorage.getItem("autopilot_token");
    const res = await fetch(`${getApiBase()}/api/dashboard/websites/${username}/publish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setIsPublished(true);
      alert("✓ Website published!");
    }
  };

  const handleUnpublish = async () => {
    const token = localStorage.getItem("autopilot_token");
    const res = await fetch(`${getApiBase()}/api/dashboard/websites/${username}/unpublish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setIsPublished(false);
      alert("✓ Website unpublished");
    }
  };

  const sections = structure?.sections || Object.keys(localContent.sections || {});

  return (
    <div className="min-h-screen bg-black">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>

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

      {editMode && (
        <Toolbar
          userPlan={userPlan}
          onSave={handleSave}
          onUndo={handleUndo}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onExit={() => router.push("/dashboard")}
          saving={saving}
          hasChanges={hasChanges}
          isPublished={isPublished}
        />
      )}
    </div>
  );
}