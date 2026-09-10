"use client";

import React, { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Props {
  initialImageUrl: string;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function HeroTab({ initialImageUrl, showToast }: Props) {
  const [heroImage, setHeroImage] = useState(initialImageUrl);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: heroImage }),
      });
      if (res.ok) {
        showToast("Hero section image updated successfully!");
      } else {
        showToast("Failed to update hero image", "error");
      }
    } catch {
      showToast("Failed to update hero image", "error");
    }
  };

  const fallback =
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-amber-100">Hero Banner Management</h2>
        <p className="text-sm text-neutral-400">
          Set and update the main showcase image on your homepage hero section.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Hero Image URL
          </label>
          <input
            type="text"
            placeholder="https://images.unsplash.com/..."
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
          />
          <p className="text-xs text-neutral-500 mt-2">
            Cloudinary credentials can be hooked here seamlessly later. A fallback image is pre-loaded.
          </p>
        </div>

        {/* Live Preview */}
        <div>
          <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Live Hero Image Preview
          </span>
          <div className="h-64 rounded-2xl overflow-hidden border border-neutral-800 relative bg-neutral-950">
            <img
              src={heroImage || fallback}
              alt="Hero Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent flex items-end p-6">
              <div>
                <span className="text-xs text-amber-400 uppercase font-semibold tracking-widest">Preview Mode</span>
                <h4 className="text-xl font-serif font-bold text-white">Handcrafted Heritage Sarees</h4>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-semibold text-sm shadow-lg transition-all"
        >
          Save Hero Section Image
        </button>
      </form>
    </div>
  );
}
