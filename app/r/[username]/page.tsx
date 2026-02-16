"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AIHTMLWebsiteRenderer from "@/components/ai/AIHTMLWebsiteRenderer";
import WebsiteEditor from "@/components/ai/WebsiteEditor";

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

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://autopilotai-api.onrender.com";
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("autopilot_token") || sessionStorage.getItem("autopilot_token");
}

export default function WebsitePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params?.username as string;
  const editRequested = searchParams.get("edit") === "1";

  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch website data
  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchWebsite = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();

        // For draft websites (?edit=1), use preview endpoint with auth
        // For published websites, use public endpoint (no auth needed)
        let url: string;
        const headers: HeadersInit = {};

        if (editRequested) {
          url = `${getApiBase()}/api/public/websites/${username}/preview`;
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        } else {
          url = `${getApiBase()}/api/public/websites/${username}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Website not found");
          } else if (res.status === 403) {
            if (editRequested) {
              throw new Error("You must be logged in as the owner to edit this website");
            } else {
              throw new Error("This website is private");
            }
          } else {
            throw new Error(`Server error: ${res.statusText}`);
          }
        }

        const response = await res.json();

        if (!response.ok || !response.data) {
          throw new Error("Invalid response format");
        }

        const website = response.data as WebsiteData;

        if (cancelled) return;

        console.log("✅ Website loaded:", {
          username: website.username,
          theme: website.metadata?.theme,
          status: website.publish_status,
        });

        setWebsiteData(website);

        // Check if user can edit (only if ?edit=1 and authenticated)
        if (editRequested && token) {
          try {
            const userRes = await fetch(`${getApiBase()}/api/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (userRes.ok) {
              const userData = await userRes.json();
              if (userData.ok || userData.data?.id) {
                setCanEdit(true);
                setEditMode(true);
                setUserPlan(userData.data?.subscription_plan || userData.subscription_plan || "free");
                console.log("✏️ Edit mode enabled for", username);
              }
            }
          } catch (e) {
            console.warn("Could not verify ownership:", e);
          }
        }

        setError(null);
      } catch (err: any) {
        if (!cancelled) {
          const errorMsg = err.message || "Failed to load website";
          console.error("❌ Error loading website:", errorMsg);
          setError(errorMsg);
          setWebsiteData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchWebsite();

    return () => {
      cancelled = true;
    };
  }, [username, editRequested]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-xl font-semibold">Loading website...</p>
            <p className="text-gray-400 text-sm mt-2">Just a moment</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !websiteData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-block p-4 bg-red-500/10 rounded-full">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Website Not Found</h1>
            <p className="text-gray-400 mb-2">{error || "This website doesn't exist"}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a
              href="/"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              ← Go Home
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
            >
              Dashboard
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Edit mode
  if (editMode && canEdit) {
    return (
      <WebsiteEditor
        username={websiteData.username}
        initialData={websiteData}
        userPlan={userPlan}
      />
    );
  }

  // View mode
  return (
    <AIHTMLWebsiteRenderer
      username={websiteData.username}
      html={websiteData.html}
      metadata={websiteData.metadata}
      businessName={websiteData.business_name}
      theme={websiteData.metadata?.theme}
      industry={websiteData.metadata?.industry}
      canEdit={canEdit}
      isPublished={websiteData.publish_status === "published"}
      editUrl={canEdit ? `${username}?edit=1` : undefined}
    />
  );
}