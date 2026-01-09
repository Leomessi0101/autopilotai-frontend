"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type RestaurantData = {
  content_json: string | Record<string, any>;
};

export default function RestaurantPage() {
  const params = useParams();
  const username = params?.username as string | undefined;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) return;

    fetch(
      `https://autopilotai-api.onrender.com/api/restaurants/${username}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [username]);

  if (!username) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading…
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Restaurant not found</h1>
          <p className="text-gray-400">
            This restaurant page does not exist yet.
          </p>
        </div>
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

  const content =
    typeof data.content_json === "string"
      ? JSON.parse(data.content_json)
      : data.content_json;

  const hours: Record<string, string> = content.hours || {};

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {content.promo?.text && (
        <div className="bg-[#e4b363] text-black text-center py-2 text-sm font-medium">
          {content.promo.text}
        </div>
      )}

      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm tracking-widest text-[#e4b363]">
            RESTAURANT
          </span>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {content.hero?.headline || username}
          </h1>

          <p className="mt-6 text-xl text-[#b5b5b5]">
            {content.hero?.subheadline}
          </p>
        </div>
      </section>
    </main>
  );
}
