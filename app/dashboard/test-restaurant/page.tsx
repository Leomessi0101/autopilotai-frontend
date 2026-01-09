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
      setError(
        err?.response?.data?.detail ||
          "Something went wrong generating the website"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">
        Test Restaurant Website Generation
      </h1>

      <button
        onClick={generate}
        disabled={loading}
        className="bg-orange-500 text-black px-6 py-3 rounded font-semibold"
      >
        {loading ? "Generating..." : "Generate Restaurant Website"}
      </button>

      {error && (
        <div className="mt-6 text-red-400">
          ❌ {error}
        </div>
      )}

      {result && (
        <pre className="mt-6 bg-black/50 p-4 rounded text-sm overflow-auto max-h-[500px]">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
