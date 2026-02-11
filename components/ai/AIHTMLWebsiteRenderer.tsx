"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ======================================================
   TYPES
====================================================== */

type ImageData = {
  id: string;
  url: string;
  size: "small" | "medium" | "large";
  position: number; // Position in section
};

type AIGeneratedSection = {
  html: string;
  data: Record<string, any>;
  images?: ImageData[];
};

type AIWebsiteData = {
  business_name: string;
  sections: Record<string, AIGeneratedSection>;
  meta?: {
    primary_color?: string;
    background_style?: string;
  };
};

type Props = {
  username: string;
  content: AIWebsiteData;
  structure: any;
  editMode: boolean;
};

/* ======================================================
   UTILS
====================================================== */

function getApiBase() {
  return (
    (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim() ||
    "https://autopilotai-api.onrender.com"
  );
}

const SIZE_CLASSES = {
  small: "max-w-sm",
  medium: "max-w-2xl",
  large: "max-w-4xl",
};

const HEIGHT_CLASSES = {
  small: "h-48",
  medium: "h-64",
  large: "h-96",
};

/* ======================================================
   IMAGE COMPONENT
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
      className={`mx-auto my-6 ${SIZE_CLASSES[image.size]}`}
      onMouseEnter={() => editMode && setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative group">
        <img
          src={image.url}
          alt=""
          className={`w-full ${HEIGHT_CLASSES[image.size]} object-cover rounded-2xl shadow-lg`}
        />

        {editMode && showControls && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-3">
              <div className="text-xs text-white/70 font-medium text-center mb-2">
                Image Size
              </div>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onResize(image.id, s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
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
                className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
              >
                Remove Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   IMAGE UPLOADER
====================================================== */

function ImageUploader({
  onUpload,
  username,
}: {
  onUpload: (url: string) => void;
  username: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      alert("You must be logged in to upload images.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${getApiBase()}/api/restaurants/${username}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (!data?.url) throw new Error("No URL returned");

      onUpload(String(data.url));
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handlePasteUrl() {
    const url = window.prompt("Paste image URL:");
    if (url && url.trim()) {
      onUpload(url.trim());
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-8 transition-colors ${
        dragOver ? "border-indigo-500 bg-indigo-500/5" : "border-gray-700 bg-gray-900/50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) uploadFile(f);
      }}
    >
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
        <svg
          className="w-12 h-12 mx-auto text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <p className="text-white font-medium mb-2">
          {uploading ? "Uploading..." : "Upload an image"}
        </p>
        <p className="text-sm text-gray-500 mb-4">Drag and drop or click below</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition font-medium disabled:opacity-50"
          >
            Choose File
          </button>
          <button
            onClick={handlePasteUrl}
            disabled={uploading}
            className="px-6 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition font-medium disabled:opacity-50"
          >
            Paste URL
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   SECTION WITH TEXT & IMAGES
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
}: {
  sectionKey: string;
  html: string;
  data: Record<string, any>;
  images: ImageData[];
  editMode: boolean;
  onUpdate: (key: string, newData: Record<string, any>) => void;
  onImagesUpdate: (key: string, images: ImageData[]) => void;
  username: string;
}) {
  const [localData, setLocalData] = useState(data);
  const [isEditingText, setIsEditingText] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  // Replace template placeholders
  const renderHTML = (template: string, values: Record<string, any>) => {
    let result = template;

    Object.keys(values).forEach((key) => {
      const value = values[key];
      const placeholder = `{{${key}}}`;

      if (Array.isArray(value)) {
        const joined = value.map(v => `<p class="mt-4">${v}</p>`).join('');
        result = result.replace(placeholder, joined);
      } else {
        result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
      }
    });

    return result;
  };

  const handleSave = async () => {
    onUpdate(sectionKey, localData);
    setIsEditingText(false);

    // Autosave
    try {
      const token = localStorage.getItem("autopilot_token");
      await fetch(`${getApiBase()}/api/restaurants/${username}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sections: {
            [sectionKey]: { html, data: localData, images }
          }
        }),
      });
    } catch (e) {
      console.error("Autosave failed:", e);
    }
  };

  const handleImageResize = (id: string, size: "small" | "medium" | "large") => {
    const updated = images.map(img => img.id === id ? { ...img, size } : img);
    onImagesUpdate(sectionKey, updated);
  };

  const handleImageRemove = (id: string) => {
    const updated = images.filter(img => img.id !== id);
    onImagesUpdate(sectionKey, updated);
  };

  const handleImageAdd = (url: string) => {
    const newImage: ImageData = {
      id: `img-${Date.now()}`,
      url,
      size: "medium",
      position: images.length,
    };
    onImagesUpdate(sectionKey, [...images, newImage]);
    setShowImageUploader(false);
  };

  if (isEditingText) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 my-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-semibold">Edit {sectionKey}</h3>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingText(false)}
              className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {Object.keys(localData).map((key) => (
            <div key={key}>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                {key}
              </label>
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
                      className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    />
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={String(localData[key])}
                  onChange={(e) => setLocalData({ ...localData, [key]: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group my-6">
      {/* Edit Controls */}
      {editMode && (
        <div className="absolute -top-3 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={() => setIsEditingText(true)}
            className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition border border-white/20 text-sm font-medium"
          >
            ✏️ Edit Text
          </button>
          <button
            onClick={() => setShowImageUploader(true)}
            className="px-4 py-2 bg-indigo-500/80 backdrop-blur-md text-white rounded-lg hover:bg-indigo-500 transition text-sm font-medium"
          >
            + Add Image
          </button>
        </div>
      )}

      {/* HTML Content */}
      <div dangerouslySetInnerHTML={{ __html: renderHTML(html, localData) }} />

      {/* Images */}
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

      {/* Image Uploader Modal */}
      {editMode && showImageUploader && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-semibold">Add Image</h3>
              <button
                onClick={() => setShowImageUploader(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ImageUploader onUpload={handleImageAdd} username={username} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   MAIN RENDERER
====================================================== */

export default function AIHTMLWebsiteRenderer({ username, content, structure, editMode }: Props) {
  const router = useRouter();
  const [localContent, setLocalContent] = useState(content);

  const handleSectionUpdate = useCallback((sectionKey: string, newData: Record<string, any>) => {
    setLocalContent((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          data: newData,
        },
      },
    }));
  }, []);

  const handleImagesUpdate = useCallback((sectionKey: string, images: ImageData[]) => {
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
  }, []);

  const sections = structure?.sections || Object.keys(localContent.sections || {});

  return (
    <main className="min-h-screen">
      {/* Edit Mode Banner */}
      {editMode && (
        <div className="sticky top-0 z-40 bg-indigo-600 text-white px-6 py-3 text-center text-sm font-medium shadow-lg">
          🎨 Edit Mode • Hover sections to edit text or add images
        </div>
      )}

      {/* Sections */}
      <div className="max-w-7xl mx-auto">
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
            />
          );
        })}
      </div>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-gray-500 border-t border-gray-800 mt-20">
        © {new Date().getFullYear()} {localContent.business_name || username}
      </footer>

      {/* Dashboard Button */}
      {editMode && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-black/90 backdrop-blur-md text-white rounded-xl hover:bg-black transition border border-white/20 shadow-xl font-medium"
          >
            ← Dashboard
          </button>
        </div>
      )}
    </main>
  );
}