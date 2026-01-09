"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function TestRestaurantPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post("/api/restaurants/generate", {
        username: "testrestaurant",
        name: "Test Restaurant",
        cuisine: "Italian",
        city: "Bangkok",
        phone: "+66 123 456 789",
        email: "contact@testrestaurant.com",
      });

      setResult(res.data);
    } catch (err: any) {
      console.error("Restaurant generation error:", err);

      if (err?.response?.data) {
        setError(JSON.stringify(err.response.data, null, 2));
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Unknown error while generating website");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Test Restaurant Website Generation
      </h1>

      <button
        onClick={generate}
        disabled={loading}
        className="bg-[#e4b363] text-black px-6 py-3 rounded font-semibold hover:opacity-90 transition"
      >
        {loading ? "Generating..." : "Generate Restaurant Website"}
      </button>

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300 whitespace-pre-wrap text-sm">
          ❌ {error}
        </div>
      )}

      {result && (
        <pre className="mt-6 max-h-[500px] overflow-auto rounded-lg bg-black/60 p-4 text-sm text-white border border-white/10">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
