"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

/* ======================================================
   TYPES
====================================================== */

type AIGeneratedSection = {
  html: string;
  data: Record<string, any>;
  images?: Record<string, string | null>;
};

type AIWebsiteData = {
  business_name: string;
  sections: Record<string, AIGeneratedSection>;
  meta: {
    primary_color: string;
    background_style: string;
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

/* ======================================================
   EDITABLE SECTION WRAPPER
====================================================== */

function EditableSection({
  sectionKey,
  html,
  data,
  images,
  editMode,
  onUpdate,
  onImageUpdate,
  username,
}: {
  sectionKey: string;
  html: string;
  data: Record<string, any>;
  images?: Record<string, string | null>;
  editMode: boolean;
  onUpdate: (key: string, newData: Record<string, any>) => void;
  onImageUpdate: (sectionKey: string, slotId: string, url: string | null) => void;
  username: string;
}) {
  const [localData, setLocalData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Replace template placeholders with actual data
  const renderHTML = (template: string, values: Record<string, any>) => {
    let result = template;
    
    Object.keys(values).forEach(key => {
      const value = values[key];
      const placeholder = `{{${key}}}`;
      
      if (Array.isArray(value)) {
        const joined = value.join('</p><p class="mt-4">');
        result = result.replace(placeholder, joined);
      } else if (typeof value === 'object' && value !== null) {
        Object.keys(value).forEach(nestedKey => {
          const nestedPlaceholder = `{{${key}.${nestedKey}}}`;
          result = result.replace(nestedPlaceholder, String(value[nestedKey]));
        });
      } else {
        result = result.replace(new RegExp(placeholder, 'g'), String(value));
      }
    });
    
    return result;
  };

  const renderedHTML = renderHTML(html, localData);

  // Inject image uploaders after render
  useEffect(() => {
    if (!containerRef.current) return;

    const imageSlots = containerRef.current.querySelectorAll('[data-image-slot]');
    
    imageSlots.forEach((slot) => {
      const slotId = slot.getAttribute('data-image-slot');
      if (!slotId) return;

      const currentUrl = images?.[slotId] || null;
      
      // Clear the slot
      slot.innerHTML = '';
      
      // Create a container for React component
      const reactContainer = document.createElement('div');
      reactContainer.className = 'w-full h-full';
      slot.appendChild(reactContainer);
      
      // Render ImageUploader
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(reactContainer);
        root.render(
          <ImageUploader
            slotId={slotId}
            username={username}
            currentUrl={currentUrl}
            onImageUpdate={(id, url) => onImageUpdate(sectionKey, id, url)}
            editMode={editMode}
          />
        );
      });
    });
  }, [renderedHTML, images, editMode, username, sectionKey, onImageUpdate]);

  const handleEdit = () => {
    if (editMode) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    onUpdate(sectionKey, localData);
    setIsEditing(false);
    
    // Autosave to backend
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
            [sectionKey]: {
              html,
              data: localData,
              images: images || {}
            }
          }
        }),
      });
    } catch (e) {
      console.error("Autosave failed:", e);
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
        
        <div className="p-6 bg-gray-900 rounded-lg">
          <h3 className="text-white mb-4 font-semibold">
            Editing: {sectionKey}
          </h3>
          {Object.keys(localData).map(key => (
            <div key={key} className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                {key}
              </label>
              {Array.isArray(localData[key]) ? (
                <div className="space-y-2">
                  {localData[key].map((item: any, idx: number) => (
                    <input
                      key={idx}
                      type="text"
                      value={typeof item === 'string' ? item : JSON.stringify(item)}
                      onChange={(e) => {
                        const newArray = [...localData[key]];
                        newArray[idx] = e.target.value;
                        setLocalData({ ...localData, [key]: newArray });
                      }}
                      className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={String(localData[key])}
                  onChange={(e) => setLocalData({ ...localData, [key]: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {editMode && (
        <div className="absolute top-4 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition border border-white/20"
          >
            ✏️ Edit Text
          </button>
        </div>
      )}
      
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: renderedHTML }}
        className={editMode ? "cursor-pointer hover:ring-2 hover:ring-indigo-500/50 rounded-lg transition" : ""}
      />
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
}: Props) {
  const router = useRouter();
  const [localContent, setLocalContent] = useState(content);

  const handleSectionUpdate = useCallback(
    (sectionKey: string, newData: Record<string, any>) => {
      setLocalContent(prev => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections[sectionKey],
            data: newData
          }
        }
      }));
    },
    []
  );

  const handleImageUpdate = useCallback(
    async (sectionKey: string, slotId: string, url: string | null) => {
      setLocalContent(prev => {
        const section = prev.sections[sectionKey];
        const updatedImages = {
          ...(section.images || {}),
          [slotId]: url
        };
        
        return {
          ...prev,
          sections: {
            ...prev.sections,
            [sectionKey]: {
              ...section,
              images: updatedImages
            }
          }
        };
      });

      // Autosave image update
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
              [sectionKey]: {
                ...localContent.sections[sectionKey],
                images: {
                  ...(localContent.sections[sectionKey].images || {}),
                  [slotId]: url
                }
              }
            }
          }),
        });
      } catch (e) {
        console.error("Image autosave failed:", e);
      }
    },
    [localContent, username]
  );

  const sections = structure?.sections || Object.keys(localContent.sections || {});

  return (
    <main className="min-h-screen">
      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-indigo-500 text-white rounded-full shadow-lg font-semibold text-sm">
          Edit Mode • Hover sections to edit • Click image areas to upload
        </div>
      )}

      {/* Render Sections */}
      {sections.map((sectionKey: string) => {
        const section = localContent.sections[sectionKey];
        
        if (!section || !section.html) {
          return null;
        }

        return (
          <EditableSection
            key={sectionKey}
            sectionKey={sectionKey}
            html={section.html}
            data={section.data || {}}
            images={section.images || {}}
            editMode={editMode}
            onUpdate={handleSectionUpdate}
            onImageUpdate={handleImageUpdate}
            username={username}
          />
        );
      })}

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} {localContent.business_name || username}
      </footer>

      {/* Dashboard Link (Edit Mode Only) */}
      {editMode && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-black/80 backdrop-blur-sm text-white rounded-xl hover:bg-black transition border border-white/20 shadow-lg"
          >
            ← Back to Dashboard
          </button>
        </div>
      )}
    </main>
  );
}