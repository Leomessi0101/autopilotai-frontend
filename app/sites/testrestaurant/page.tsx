import React from "react";

async function getRestaurant() {
  const res = await fetch(
    "https://autopilotai-api.onrender.com/api/websites/restaurant/testrestaurant",
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load restaurant");
  }

  return res.json();
}

export default async function RestaurantPage() {
  const data = await getRestaurant();
  const content = JSON.parse(data.content_json);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* HERO */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm tracking-widest text-[#e4b363]">
            RESTAURANT
          </span>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {content.hero?.headline || "Restaurant Name"}
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
            Welcome to our restaurant. We focus on quality ingredients, warm
            atmosphere, and food you’ll remember long after the last bite.
          </p>
        </div>
      </section>
    </main>
  );
}
