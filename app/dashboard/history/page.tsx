"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function HistoryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://127.0.0.1:8000/api/history", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setItems(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Saved Content</h1>

      {items.length === 0 && (
        <p>No saved content yet. Generate something!</p>
      )}

      <div className="space-y-6">
        {items.map((item: any) => (
          <div key={item.id} className="p-4 bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-400 uppercase mb-2">
              {item.content_type}
            </p>
            <p className="text-gray-300 mb-2"><b>Prompt:</b> {item.prompt}</p>
            <p className="text-white whitespace-pre-wrap">{item.result}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
