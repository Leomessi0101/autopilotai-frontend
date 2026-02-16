"use client";

import { useState, useRef, useEffect } from "react";
import AIHTMLWebsiteRenderer from "./AIHTMLWebsiteRenderer";

type WebsiteData = {
  id: number;
  username: string;
  template: string;
  html: string;
  metadata?: Record<string, any>;
  prompt?: string;
  business_name?: string;
  publish_status: "draft" | "published";
  custom_domain?: string;
  domain_verified?: boolean;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  username: string;
  initialData: WebsiteData;
  userPlan: string;
};

export default function WebsiteEditor({ username, initialData, userPlan }: Props) {
  const [data, setData] = useState(initialData);
  const [prompt, setPrompt] = useState(data.prompt || "");
  const [businessName, setBusinessName] = useState(data.business_name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // FIX: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://autopilotai-api.onrender.com";

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("autopilot_token") || sessionStorage.getItem("autopilot_token");
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => setMessage(null), 4000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = getToken();

      const res = await fetch(`${apiBase}/api/dashboard/websites/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_name: businessName,
          prompt: prompt,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const result = await res.json();
      if (result.ok) {
        showMessage("success", "Website updated successfully!");
        setData({ ...data, business_name: businessName, prompt: prompt });
      } else {
        throw new Error(result.detail || "Save failed");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!prompt.trim()) {
      showMessage("error", "Please enter a business description");
      return;
    }

    try {
      setIsRegenerating(true);
      const token = getToken();

      const res = await fetch(`${apiBase}/api/dashboard/websites/${username}/regenerate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) throw new Error("Regeneration failed");

      const result = await res.json();
      if (result.ok && result.data) {
        // Refresh the website data
        const websiteRes = await fetch(`${apiBase}/api/dashboard/websites/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (websiteRes.ok) {
          const websiteResult = await websiteRes.json();
          if (websiteResult.ok && websiteResult.data) {
            setData(websiteResult.data);
            showMessage("success", "Website regenerated with new design!");
          }
        }
      } else {
        throw new Error(result.detail || "Regeneration failed");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Regeneration failed");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex bg-slate-950 z-30">
      {/* Left: Editor Panel */}
      <div className="w-96 bg-slate-900 border-r border-slate-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white mb-1">{businessName || username}</h2>
          <p className="text-sm text-gray-400">Editing website</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="Your business name"
            />
          </div>

          {/* Business Description / Prompt */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Business Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none"
              placeholder="Describe your business, products, services..."
            />
            <p className="text-xs text-gray-500 mt-2">
              This description is used to generate your website design
            </p>
          </div>

          {/* Theme Info */}
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-xs font-semibold text-gray-300 mb-2">CURRENT DESIGN</p>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400">
                <span className="text-gray-500">Theme:</span> <span className="text-indigo-400">{data.metadata?.theme || "pro_light"}</span>
              </p>
              <p className="text-gray-400">
                <span className="text-gray-500">Industry:</span> <span className="text-indigo-400">{data.metadata?.industry || "tech"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-700 space-y-3">
          {message && (
            <div
              className={`text-sm px-4 py-2 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/30"
                  : "bg-red-500/10 text-red-400 border border-red-500/30"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating || !prompt.trim()}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isRegenerating ? "Generating..." : "🔄 Regenerate Design"}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSaving ? "Saving..." : "💾 Save Changes"}
          </button>

          <a
            href={`/r/${username}`}
            className="block w-full px-4 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition text-center"
          >
            ← Done Editing
          </a>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 overflow-hidden">
        <AIHTMLWebsiteRenderer
          username={username}
          html={data.html}
          metadata={data.metadata}
          businessName={data.business_name}
          theme={data.metadata?.theme}
          industry={data.metadata?.industry}
          canEdit={true}
        />
      </div>
    </div>
  );
}