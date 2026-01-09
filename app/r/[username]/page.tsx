"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type RestaurantData = {
  content_json: string;
};

export default function RestaurantPage() {
  const params = useParams();
  const username = params?.username as string | undefined;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) return;

    fetch(
      `https://autopilotai-api.onrender.com/api/websites/restaurant/${username}`
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

  const content = JSON.parse(data.content_json);

  const hours: Record<string, string> = content.hours || {
    monday: "10:00 – 22:00",
    tuesday: "10:00 – 22:00",
    wednesday: "10:00 – 22:00",
    thursday: "10:00 – 22:00",
    friday: "10:00 – 23:00",
    saturday: "12:00 – 23:00",
    sunday: "Closed",
  };

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
            {content.hero?.subheadline || "Amazing food, unforgettable taste"}
          </p>

          <div className="mt-10">
            <button className="rounded-full bg-[#e4b363] px-8 py-3 text-black font-semibold hover:opacity-90 transition">
              View Menu
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
              Opening Hours
            </h3>

            <ul className="space-y-3 text-[#b5b5b5]">
              {Object.entries(hours).map(([day, time]) => (
                <li
                  key={day}
                  className="flex justify-between border-b border-white/10 pb-2 capitalize"
                >
                  <span>{day}</span>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
              Contact Us
            </h3>

            <p className="text-[#b5b5b5] mb-3">
              📞 {content.contact?.phone || "+1 234 567 890"}
            </p>

            {content.contact?.email && (
              <p className="text-[#b5b5b5] mb-3">✉️ {content.contact.email}</p>
            )}

            {content.contact?.address && (
              <p className="text-[#b5b5b5]">📍 {content.contact.address}</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
