"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import RestaurantTemplate from "@/components/templates/RestaurantTemplate";
import BusinessTemplate from "@/components/templates/BusinessTemplate";
import AIWebsiteRenderer from "@/components/ai/AIWebsiteRenderer";

/* ======================================================
   TYPES
====================================================== */

type WebsiteResponse = {
  username: string;
  template: string;
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
   TEMPLATE REGISTRY
====================================================== */

const TEMPLATE_MAP: Record<
  string,
  React.ComponentType<{
    username: string;
    content: any;
    editMode: boolean;
  }>
> = {
  restaurant: RestaurantTemplate,
  business: BusinessTemplate,
};

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
      .then((res) => {
        if (cancelled) return;

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
     PARSE JSON
  ====================================================== */

  const content =
    typeof data.content_json === "string"
      ? JSON.parse(data.content_json)
      : data.content_json;

  const aiStructure =
    data.ai_structure_json
      ? typeof data.ai_structure_json === "string"
        ? JSON.parse(data.ai_structure_json)
        : data.ai_structure_json
      : null;

  /* ======================================================
     AI RENDER PATH (NEW)
  ====================================================== */

  if (aiStructure) {
    return (
      <AIWebsiteRenderer
        username={username}
        structure={aiStructure}
        content={content}
        editMode={editRequested && canEdit}
      />
    );
  }

  /* ======================================================
     TEMPLATE FALLBACK (EXISTING)
  ====================================================== */

  const Template = TEMPLATE_MAP[data.template];

  if (!Template) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Unknown template: {data.template}
      </main>
    );
  }

  return (
    <Template
      username={username}
      content={content}
      editMode={editRequested && canEdit}
    />
  );
}
