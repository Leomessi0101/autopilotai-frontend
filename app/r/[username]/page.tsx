"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AIHTMLWebsiteRenderer from "@/components/ai/AIHTMLWebsiteRenderer";

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
   AUTH HELPERS
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

        console.log("🔍 RAW API RESPONSE:", res);

        setData(res);

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
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading your website...</p>
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

  console.log("🧠 CONTENT_JSON USED:", content);

  /* ======================================================
     PARSE AI STRUCTURE
  ====================================================== */

  const aiStructure =
    data.ai_structure_json
      ? typeof data.ai_structure_json === "string"
        ? JSON.parse(data.ai_structure_json)
        : data.ai_structure_json
      : null;

  console.log("🧱 AI STRUCTURE USED:", aiStructure);

  const editMode = editRequested && canEdit;

  /* ======================================================
     VALIDATE STRUCTURE
  ====================================================== */

  if (!aiStructure) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">AI structure missing</h2>
          <p className="text-gray-400">This website wasn't generated with the new AI system. Please create a new website to use the latest features.</p>
        </div>
      </main>
    );
  }

  /* ======================================================
     CHECK IF HTML MODE
  ====================================================== */

  const isHTMLMode = aiStructure?.html_mode === true || (content?.sections && typeof content.sections === 'object');

  if (!isHTMLMode) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-amber-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Old website format</h2>
          <p className="text-gray-400 mb-6">This website was created with the old system. Create a new website to get unique AI-generated designs!</p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
          >
            Go to Dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </main>
    );
  }

  /* ======================================================
     RENDER HTML MODE
  ====================================================== */

 return (
  <AIHTMLWebsiteRenderer
    username={username}
    structure={aiStructure}
    content={content}
    editMode={editMode}
  />
);
}