"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AIHTMLWebsiteRenderer from "@/components/ai/AIHTMLWebsiteRenderer";

type WebsiteResponse = {
  username: string;
  content_json?: string | Record<string, any>;
  ai_structure_json?: string | Record<string, any>;
  template?: string;
  user_id?: number;
  suspended?: boolean;
  publish_status?: string;
};

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://autopilotai-api.onrender.com";
}

function getUserIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id ?? null;
  } catch {
    return null;
  }
}

export default function WebsitePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params?.username as string;
  const editRequested = searchParams.get("edit") === "1";

  const [data, setData] = useState<WebsiteResponse | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    const fetchWebsite = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/restaurants/${username}`);
        if (!res.ok) throw new Error("Website not found");

        const websiteData: WebsiteResponse = await res.json();
        if (cancelled) return;

        console.log("🔍 API RESPONSE:", websiteData);

        setData(websiteData);
        setIsPublished(websiteData.publish_status === "published");

        if (editRequested && websiteData.user_id) {
          const token = localStorage.getItem("autopilot_token");
          if (token) {
            const tokenUserId = getUserIdFromToken(token);
            if (tokenUserId === websiteData.user_id) {
              setCanEdit(true);
              
              try {
                const userRes = await fetch(`${getApiBase()}/api/auth/me`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (userRes.ok) {
                  const userData = await userRes.json();
                  setUserPlan(userData.subscription_plan || "free");
                  console.log("👤 User plan:", userData.subscription_plan);
                }
              } catch (e) {
                console.error("Failed to fetch user:", e);
              }
            }
          }
        }

        setLoading(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load");
          setLoading(false);
        }
      }
    };

    fetchWebsite();
    return () => { cancelled = true; };
  }, [username, editRequested]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Website Not Found</h2>
          <p className="text-gray-400 mb-6">{error || "No data"}</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition font-semibold">
            ← Go Home
          </a>
        </div>
      </main>
    );
  }

  let content, aiStructure;
  try {
    content = typeof data.content_json === "string" ? JSON.parse(data.content_json) : data.content_json || {};
    aiStructure = data.ai_structure_json ? (typeof data.ai_structure_json === "string" ? JSON.parse(data.ai_structure_json) : data.ai_structure_json) : null;
    console.log("📄 CONTENT:", content);
    console.log("🏗️ STRUCTURE:", aiStructure);
  } catch (parseError) {
    console.error("Parse error:", parseError);
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Data Error</h2>
          <p className="text-gray-400">Failed to parse website data</p>
        </div>
      </main>
    );
  }

  if (!aiStructure || !content?.sections) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Old Format</h2>
          <p className="text-gray-400 mb-6">Please create a new website</p>
          <a href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition font-semibold">
            Go to Dashboard
          </a>
        </div>
      </main>
    );
  }

  const editMode = editRequested && canEdit;

  console.log("✅ RENDERING:", { username, editMode, userPlan, isPublished, sections: Object.keys(content.sections).length });

  return (
    <AIHTMLWebsiteRenderer
      username={username}
      content={content}
      structure={aiStructure}
      editMode={editMode}
      userPlan={userPlan}
      isPublished={isPublished}
    />
  );
}