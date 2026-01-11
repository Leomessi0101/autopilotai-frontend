"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RestaurantTemplate from "@/components/templates/RestaurantTemplate";

/* ======================================================
   TYPES
====================================================== */

type WebsiteResponse = {
  username: string;
  template: string;
  content_json: string | Record<string, any>;
  user_id?: number;
};

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

const TEMPLATE_MAP: Record<string, any> = {
  restaurant: RestaurantTemplate,
  // gym: GymTemplate,
  // barber: BarberTemplate,
};

/* ======================================================
   PAGE
====================================================== */

export default function WebsitePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const editRequested = searchParams.get("edit") === "1";

  const username = params?.username as string;

  const [data, setData] = useState<WebsiteResponse | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  /* ======================================================
     FETCH WEBSITE
  ====================================================== */

  useEffect(() => {
    if (!username) return;

    fetch(`https://autopilotai-api.onrender.com/api/restaurants/${username}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);

        if (editRequested && res.user_id) {
          const token = localStorage.getItem("autopilot_token");
          if (!token) return;

          if (getUserIdFromToken(token) === res.user_id) {
            setCanEdit(true);
          }
        }
      });
  }, [username, editRequested]);

  /* ======================================================
     LOADING
  ====================================================== */

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading…
      </main>
    );
  }

  /* ======================================================
     TEMPLATE SELECTION
  ====================================================== */

  const Template = TEMPLATE_MAP[data.template];

  if (!Template) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Unknown template
      </main>
    );
  }

  const content =
    typeof data.content_json === "string"
      ? JSON.parse(data.content_json)
      : data.content_json;

  /* ======================================================
     RENDER TEMPLATE
  ====================================================== */

  return (
    <Template
      username={username}
      content={content}
      editMode={editRequested && canEdit}
    />
  );
}
