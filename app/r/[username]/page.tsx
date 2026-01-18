"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AIWebsiteRenderer from "@/components/ai/AIWebsiteRenderer";

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
        Loading…
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
     HARD REQUIRE AI STRUCTURE
  ====================================================== */

  if (!aiStructure) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        AI structure missing — generation failed
      </main>
    );
  }

  /* ======================================================
     AI RENDER (ONLY PATH)
  ====================================================== */

  return (
    <AIWebsiteRenderer
      username={username}
      structure={aiStructure}
      content={content}
      editMode={editMode}
    />
  );
}
