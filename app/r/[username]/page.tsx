import React from "react";

async function getRestaurant(username: string) {
  const res = await fetch(
    `https://autopilotai-api.onrender.com/api/websites/restaurant/${username}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Restaurant not found");
  }

  return res.json();
}

export default async function RestaurantPage({
  params,
}: {
  params: { username: string };
}) {
  const data = await getRestaurant(params.username);
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
      {/* PROMO BAR */}
      {content.promo?.text && (
        <div className="bg-[#e4b363] text-black text-center py-2 text-sm font-medium">
          {content.promo.text}
        </div>
      )}

      {/* HERO */}
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

      {/* ABOUT */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold text-[#e4b363]">
            Our Story
          </h2>

          <p className="mt-6 text-lg text-[#b5b5b5]">
            {content.about?.text ||
              "We focus on quality ingredients, warm atmosphere, and food you’ll remember long after the last bite."}
          </p>
        </div>
      </section>

      {/* OPENING HOURS + CONTACT */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2">
          {/* HOURS */}
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

          {/* CONTACT */}
          <div>
            <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
              Contact Us
            </h3>

            <p className="text-[#b5b5b5] mb-3">
              📞 {content.contact?.phone || "+1 234 567 890"}
            </p>

            {content.contact?.email && (
              <p className="text-[#b5b5b5] mb-3">
                ✉️ {content.contact.email}
              </p>
            )}

            {content.contact?.address && (
              <p className="text-[#b5b5b5]">
                📍 {content.contact.address}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
