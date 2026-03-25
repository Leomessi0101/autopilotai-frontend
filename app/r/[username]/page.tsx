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

type PageState =
  | { status: "loading" }
  | { status: "editor"; data: WebsiteData; plan: string }
  | { status: "viewer"; data: WebsiteData; canEdit: boolean }
  | { status: "error"; message: string };

function getApiBase() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    "https://autopilotai-api.onrender.com"
  );
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("autopilot_token") ||
    sessionStorage.getItem("autopilot_token")
  );
}

export default function WebsitePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params?.username as string;
  const editRequested = searchParams.get("edit") === "1";

  const [page, setPage] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    if (!username) {
      setPage({ status: "error", message: "No username provided" });
      return;
    }

    let cancelled = false;
    const API = getApiBase();
    const token = getAuthToken();

    async function load() {
      setPage({ status: "loading" });

      // ── EDIT MODE ────────────────────────────────────────────────────────
      if (editRequested) {
        if (!token) {
          setPage({
            status: "error",
            message: "You must be logged in to edit this website",
          });
          return;
        }

        // 1. Fetch website via authenticated dashboard endpoint
        //    (works for both draft and published)
        let websiteData: WebsiteData | null = null;

        try {
          const res = await fetch(
            `${API}/api/dashboard/websites/${username}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.ok) {
            const json = await res.json();
            if (json.ok && json.data) {
              websiteData = json.data as WebsiteData;
            }
          }

          // Fallback: try preview endpoint if dashboard endpoint failed
          if (!websiteData) {
            const previewRes = await fetch(
              `${API}/api/public/websites/${username}/preview`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (previewRes.ok) {
              const json = await previewRes.json();
              if (json.ok && json.data) websiteData = json.data as WebsiteData;
            }
          }
        } catch (err) {
          console.error("Failed to fetch website for editing:", err);
        }

        if (cancelled) return;

        if (!websiteData) {
          setPage({
            status: "error",
            message:
              "Could not load website for editing. Make sure you are the owner and logged in.",
          });
          return;
        }

        // 2. Fetch user plan
        let plan = "free";
        try {
          const meRes = await fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const me = await meRes.json();
            plan =
              me?.data?.subscription ||
              me?.subscription ||
              "free";
          }
        } catch {
          // non-fatal — default to free
        }

        if (cancelled) return;

        console.log("✏️ Editor ready for", username, "plan:", plan);
        setPage({ status: "editor", data: websiteData, plan });
        return;
      }

      // ── VIEW MODE ────────────────────────────────────────────────────────
      try {
        const res = await fetch(`${API}/api/public/websites/${username}`);

        if (!res.ok) {
          if (res.status === 404) throw new Error("Website not found");
          if (res.status === 403) throw new Error("This website is private");
          throw new Error(`Server error (${res.status})`);
        }

        const json = await res.json();
        if (!json.ok || !json.data) throw new Error("Invalid response");

        if (cancelled) return;

        const data = json.data as WebsiteData;

        // Check if the viewer is the owner (to show edit button)
        let canEdit = false;
        if (token) {
          try {
            const meRes = await fetch(`${API}/api/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (meRes.ok) {
              const me = await meRes.json();
              const userId = me?.data?.id || me?.id;
              // We can't directly compare without user_id on website,
              // so just check they're logged in — the edit button redirects
              // to ?edit=1 which does a real auth check server-side
              if (userId) canEdit = true;
            }
          } catch {
            // non-fatal
          }
        }

        if (cancelled) return;
        setPage({ status: "viewer", data, canEdit });
      } catch (err: any) {
        if (!cancelled) {
          console.error("❌ Error loading website:", err.message);
          setPage({ status: "error", message: err.message || "Failed to load website" });
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [username, editRequested]);

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (page.status === "loading") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#09090b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid #27272a",
              borderTopColor: "#059669",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#71717a", fontSize: 14, margin: 0 }}>
            {editRequested ? "Loading editor…" : "Loading website…"}
          </p>
        </div>
      </main>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────────────────
  if (page.status === "error") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#09090b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 400, textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 28,
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {page.message.includes("not found")
              ? "Website Not Found"
              : "Something went wrong"}
          </h1>
          <p style={{ color: "#71717a", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
            {page.message}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/dashboard"
              style={{
                padding: "10px 22px",
                background: "#059669",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Dashboard
            </a>
            <a
              href="/"
              style={{
                padding: "10px 22px",
                background: "#27272a",
                color: "#a1a1aa",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ── EDITOR ───────────────────────────────────────────────────────────────
  if (page.status === "editor") {
    return (
      <WebsiteEditor
        username={page.data.username}
        initialData={page.data}
        userPlan={page.plan}
      />
    );
  }

  // ── VIEWER ───────────────────────────────────────────────────────────────
  return (
    <AIHTMLWebsiteRenderer
      username={page.data.username}
      html={page.data.html}
      metadata={page.data.metadata}
      businessName={page.data.business_name}
      theme={page.data.metadata?.theme}
      industry={page.data.metadata?.industry}
      canEdit={page.canEdit}
      isPublished={page.data.publish_status === "published"}
      editUrl={
        page.canEdit ? `/r/${page.data.username}?edit=1` : undefined
      }
    />
  );
}