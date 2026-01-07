"use client";

export default function GrowthPackPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">
        One-Click Growth Pack
      </h1>

      <p className="text-gray-600 mb-8">
        Describe your business once. Get content, emails, and ads instantly.
      </p>

      {/* INPUT */}
      <textarea
        placeholder="Describe your product or business..."
        className="w-full h-40 border rounded-lg p-4 mb-6"
      />

      {/* BUTTON */}
      <button
        className="bg-black text-white px-6 py-3 rounded-lg font-medium"
      >
        Generate Growth Pack
      </button>

      {/* RESULTS PLACEHOLDER */}
      <div className="mt-12 space-y-6 opacity-40">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Social Posts</h3>
          <p>Generated content will appear here</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Cold Email</h3>
          <p>Generated email will appear here</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Ad Copy</h3>
          <p>Generated ad copy will appear here</p>
        </div>
      </div>
    </div>
  );
}
