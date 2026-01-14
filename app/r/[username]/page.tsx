"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AIWebsiteRenderer from "@/components/ai/AIWebsiteRenderer";
import { generateAIStructure } from "@/components/ai/generateAIStructure";

/* ======================================================
   TYPES
====================================================== */

type WebsiteResponse = {
  username: string;
  content_json: string | Record<string, any>;
  ai_structure_json?: string | Record<string, any>;
  user_id?: number;
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

        // Edit permission check
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
      : data.content_json;

  /* ======================================================
     AI STRUCTURE (LEGO ENGINE)
  ====================================================== */

  const structure =
    data.ai_structure_json
      ? typeof data.ai_structure_json === "string"
        ? JSON.parse(data.ai_structure_json)
        : data.ai_structure_json
      : generateAIStructure({
          businessType: "local",
          goal: "leads",
        });

  /* ======================================================
     RENDER (AI ONLY)
  ====================================================== */

  return (
    <AIWebsiteRenderer
      username={username}
      structure={structure}
      content={content}
      editMode={editRequested && canEdit}
    />
  );
}
