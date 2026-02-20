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

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = getToken();
      const res = await fetch(`${apiBase}/api/dashboard/websites/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ business_name: businessName, prompt }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const result = await res.json();
      if (result.ok) {
        showMessage("success", "Saved!");
        setData({ ...data, business_name: businessName, prompt });
      } else throw new Error(result.detail || "Save failed");
    } catch (err: any) {
      showMessage("error", err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!prompt.trim()) return showMessage("error", "Please enter a business description");
    if (!businessName.trim()) return showMessage("error", "Please enter a business name");

    try {
      setIsRegenerating(true);
      const token = getToken();

      // ── CRITICAL FIX: send BOTH business_name AND prompt ──
      // business_name → appears in nav/footer/headings (never derived from prompt)
      // prompt        → used by AI to generate relevant copy, images, industry detection
      const res = await fetch(`${apiBase}/api/dashboard/websites/${username}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          business_name: businessName.trim(),
          prompt: prompt.trim(),
        }),
      });

      if (!res.ok) throw new Error("Regeneration failed");
      const result = await res.json();

      if (result.ok && result.data) {
        // Fetch the freshly generated website data and update preview
        const websiteRes = await fetch(`${apiBase}/api/dashboard/websites/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (websiteRes.ok) {
          const websiteResult = await websiteRes.json();
          if (websiteResult.ok && websiteResult.data) {
            setData(websiteResult.data);
            showMessage("success", `Regenerated! Theme: ${websiteResult.data.metadata?.theme} · Industry: ${websiteResult.data.metadata?.industry}`);
          }
        }
      } else throw new Error(result.detail || "Regeneration failed");
    } catch (err: any) {
      showMessage("error", err.message || "Regeneration failed");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex bg-slate-950 z-30">
      {/* ── Left Panel: Editor ── */}
      <div className="w-96 bg-slate-900 border-r border-slate-700 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white mb-1">{businessName || username}</h2>
          <p className="text-sm text-gray-400">
            {data.metadata?.industry && (
              <span className="inline-block px-2 py-0.5 bg-slate-800 rounded text-xs text-indigo-400 mr-2">
                {data.metadata.industry}
              </span>
            )}
            {data.metadata?.theme && (
              <span className="inline-block px-2 py-0.5 bg-slate-800 rounded text-xs text-purple-400">
                {data.metadata.theme}
              </span>
            )}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 text-white border border-slate-600 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition text-sm"
              placeholder="Your business name"
            />
            <p className="text-xs text-gray-600 mt-1.5">Appears in nav, footer, and headings</p>
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Business Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={7}
              className="w-full px-4 py-2.5 bg-slate-800 text-white border border-slate-600 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none text-sm"
              placeholder="Describe your business, what you do, who you serve, and any special details (e.g. prices after visit, 24/7 service)..."
            />
            <p className="text-xs text-gray-600 mt-1.5">
              The AI reads this to pick your industry, theme, photos, and write your copy.
              Be specific — mention your services, location, pricing model, and anything unique.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">💡 Tips</p>
            <ul className="text-xs text-gray-500 space-y-1.5">
              <li>• Say "prices decided after visit" → no pricing shown</li>
              <li>• Mention your city for local SEO copy</li>
              <li>• Include credentials (licensed, insured, certified)</li>
              <li>• Name specific services for relevant photos</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-700 space-y-3">
          {message && (
            <div className={`text-sm px-4 py-2.5 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating || !prompt.trim() || !businessName.trim()}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
          >
            {isRegenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Generating new design...
              </span>
            ) : "🔄 Regenerate Website"}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
          >
            {isSaving ? "Saving..." : "💾 Save Changes"}
          </button>

          <a
            href={`/r/${username}`}
            className="block w-full px-4 py-3 bg-transparent text-gray-400 font-semibold rounded-lg hover:text-white border border-slate-700 hover:border-slate-500 transition text-center text-sm"
          >
            ← Exit Editor
          </a>
        </div>
      </div>

      {/* ── Right Panel: Live Preview ── */}
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