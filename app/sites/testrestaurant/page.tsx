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
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {content.hero?.headline || "Restaurant Name"}
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            {content.hero?.subheadline || "Amazing food, unforgettable taste"}
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold">About Us</h2>
          <p className="mt-6 text-lg text-gray-300">
            Welcome to our restaurant. We focus on quality ingredients, great
            atmosphere, and food you’ll remember.
          </p>
        </div>
      </section>
    </main>
  );
}
