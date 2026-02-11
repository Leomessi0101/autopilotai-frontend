"use client";

import { useRef, useState } from "react";

type ImageUploaderProps = {
  slotId: string;
  username: string;
  currentUrl: string | null;
  onImageUpdate: (slotId: string, url: string | null) => void;
  editMode: boolean;
};

function getApiBase() {
  return (
    (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim() ||
    "https://autopilotai-api.onrender.com"
  );
}

export default function ImageUploader({
  slotId,
  username,
  currentUrl,
  onImageUpdate,
  editMode,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    if (!editMode) return;
    
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.detail || "Upload failed");
      }

      const data = await res.json();
      if (!data?.url) throw new Error("No URL returned");
      
      onImageUpdate(slotId, String(data.url));
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handlePasteUrl() {
    const url = window.prompt("Paste image URL:");
    if (url && url.trim()) {
      onImageUpdate(slotId, url.trim());
    }
  }

  if (!editMode && !currentUrl) {
    // Don't show placeholder if not in edit mode and no image
    return null;
  }

  if (currentUrl) {
    return (
      <div className="relative group">
        <img
          src={currentUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        
        {editMode && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition text-sm font-medium"
            >
              {uploading ? "Uploading..." : "Replace"}
            </button>
            
            <button
              onClick={handlePasteUrl}
              disabled={uploading}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition text-sm font-medium"
            >
              Paste URL
            </button>
            
            <button
              onClick={() => onImageUpdate(slotId, null)}
              disabled={uploading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              Remove
            </button>
          </div>
        )}
        
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
      </div>
    );
  }

  // No image, edit mode - show upload placeholder
  return (
    <div
      className={`relative transition-all ${
        dragOver ? "ring-2 ring-indigo-500" : ""
      }`}
      onDragOver={(e) => {
        if (!editMode) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!editMode) return;
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

      <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-8 cursor-pointer"
        onClick={() => editMode && inputRef.current?.click()}
      >
        <svg
          className="w-12 h-12 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        
        <div className="text-center">
          <p className="text-sm font-medium text-gray-400 mb-1">
            {uploading ? "Uploading..." : "Click to upload image"}
          </p>
          <p className="text-xs text-gray-600">
            or drag and drop
          </p>
        </div>
        
        {!uploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePasteUrl();
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            Paste URL instead
          </button>
        )}
      </div>
    </div>
  );
}