export const dynamic = "force-dynamic";

import React from "react";

async function getRestaurantWithDebug(username: string) {
  const url = `https://autopilotai-api.onrender.com/api/websites/restaurant/${encodeURIComponent(
    username
  )}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    // Try to parse JSON if possible
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    return {
      ok: res.ok,
      status: res.status,
      url,
      raw: text,
      json,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      url,
      raw: String(err?.message || err),
      json: null,
    };
  }
}

export default async function RestaurantPage({
  params,
}: {
  params: { username: string };
}) {
  const result = await getRestaurantWithDebug(params.username);

  // If backend fetch failed, show a clear debug panel
  if (!result.ok) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">Restaurant not found (debug)</h1>
          <p className="mt-2 text-white/70">
            The page tried to load the restaurant from your API but got a non-200
            response.
          </p>

          <div className="mt-6 space-y-2 text-sm">
            <div>
              <span className="text-white/60">URL:</span>{" "}
              <span className="break-all">{result.url}</span>
            </div>
            <div>
              <span className="text-white/60">Status:</span>{" "}
              <span>{result.status}</span>
            </div>
            <div className="mt-4">
              <span className="text-white/60">Body:</span>
              <pre className="mt-2 max-h-[260px] overflow-auto rounded-xl bg-black/60 p-4 text-white/80 border border-white/10">
                {result.raw}
              </pre>
            </div>
          </div>

          <p className="mt-6 text-white/60 text-sm">
            If Status is 404: backend says username doesn’t exist (but you proved
            it does in browser, so then it’s likely the frontend isn’t actually
            hitting the same URL or it’s being blocked/rewritten).
            <br />
            If Status is 0 or shows a network error: Vercel can’t reach Render.
            <br />
            If Status is 403/401: auth or middleware is blocking.
            <br />
            If Status is 500: server error on Render.
          </p>
        </div>
      </main>
    );
  }

  // If it worked, render the site (same design)
  const data = result.json;
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
            {content.hero?.headline || params.username}
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
