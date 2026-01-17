"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AIWebsiteRenderer from "@/components/ai/AIWebsiteRenderer";
import RestaurantTemplate from "@/components/templates/RestaurantTemplate";
import BusinessTemplate from "@/components/templates/BusinessTemplate";

/* ======================================================
   TYPES
====================================================== */

type WebsiteResponse = {
  username: string;
  content_json?: string | Record<string, any>;
  ai_structure_json?: string | Record<string, any>;
  template?: "restaurant" | "business";
  user_id?: number;
  suspended?: boolean;
};

/* ======================================================
   AUTH HELPERS (CLIENT-SIDE ONLY)
====================================================== */

function getUserIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id ?? null;
  } catch {
    return null;
  }
}

/* ======================================================
   PAGE
====================================================== */

export default function WebsitePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const username = params?.username as string;
  const editRequested = searchParams.get("edit") === "1";

  const [data, setData] = useState<WebsiteResponse | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ======================================================
     FETCH WEBSITE
  ====================================================== */

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    fetch(`https://autopilotai-api.onrender.com/api/restaurants/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Website not found");
        return res.json();
      })
      .then((res: WebsiteResponse) => {
        if (cancelled) return;

        setData(res);

        // Owner edit access (even if suspended)
        if (editRequested && res.user_id) {
          const token = localStorage.getItem("autopilot_token");
          if (!token) return;

          if (getUserIdFromToken(token) === res.user_id) {
            setCanEdit(true);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setError("Website not found");
      });

    return () => {
      cancelled = true;
    };
  }, [username, editRequested]);

  /* ======================================================
     LOADING / ERROR
  ====================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        {error}
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading…
      </main>
    );
  }

  /* ======================================================
     SUSPENDED (PUBLIC PAYWALL)
  ====================================================== */

  if (data.suspended && !canEdit) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <div className="rounded-3xl border border-black/10 p-8 text-center shadow-sm">
            <h1 className="text-2xl font-semibold">
              This website is temporarily unavailable
            </h1>
            <p className="mt-3 text-sm text-black/70">
              The owner’s subscription is inactive.
            </p>

            <div className="mt-6">
              <a
                href="/pricing"
                className="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
              >
                Reactivate subscription
              </a>
            </div>

            <div className="mt-4 text-xs text-black/50">
              Powered by AutopilotAI
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ======================================================
     PARSE CONTENT
  ====================================================== */

  const content =
    typeof data.content_json === "string"
      ? JSON.parse(data.content_json)
      : data.content_json || {};

  /* ======================================================
     PARSE AI STRUCTURE
  ====================================================== */

  const aiStructure =
    data.ai_structure_json
      ? typeof data.ai_structure_json === "string"
        ? JSON.parse(data.ai_structure_json)
        : data.ai_structure_json
      : null;

  const editMode = editRequested && canEdit;

  /* ======================================================
     RENDER (AI → TEMPLATE FALLBACK)
  ====================================================== */

  // ✅ AI-rendered website (primary path)
  if (aiStructure) {
    return (
      <AIWebsiteRenderer
        username={username}
        structure={aiStructure}
        content={content}
        editMode={editMode}
      />
    );
  }

  // ✅ Restaurant fallback
  if (data.template === "restaurant") {
    return (
      <RestaurantTemplate
        username={username}
        content={content}
        editMode={editMode}
      />
    );
  }

  // ✅ Business fallback
  if (data.template === "business") {
    return (
      <BusinessTemplate
        username={username}
        content={content}
        editMode={editMode}
      />
    );
  }

  // ❌ Safety net
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      Website configuration error
    </main>
  );
}
