"use client";

import React, { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Props {
  onSuccess: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

const PRESET_CATEGORIES = [
  "Kanjivaram Silk",
  "Banarasi Brocade",
  "Chanderi Cotton",
  "Organza Sheer",
  "Tussar Silk",
  "Bridal Collection",
  "Bandhani Tie & Dye",
  "Patan Patola",
  "Linen Wear",
  "Paithani",
  "Other (custom)",
];

const SAREE_COLORS = [
  { label: "Ruby Red", hex: "#9B1B30" },
  { label: "Deep Maroon", hex: "#5C1A1A" },
  { label: "Royal Blue", hex: "#1B3A6B" },
  { label: "Peacock Green", hex: "#006B5E" },
  { label: "Gold", hex: "#C8960C" },
  { label: "Ivory", hex: "#F5F0E8" },
  { label: "Mustard", hex: "#C89A2A" },
  { label: "Rose Pink", hex: "#D4687A" },
  { label: "Violet", hex: "#6B3FA0" },
  { label: "Brick Orange", hex: "#C4562A" },
  { label: "Teal", hex: "#0F7E7E" },
  { label: "Navy", hex: "#1A237E" },
  { label: "Beige", hex: "#D4C5A9" },
  { label: "Black", hex: "#1A1A1A" },
  { label: "White", hex: "#F8F8F8" },
];

export default function AddProductTab({ onSuccess, showToast }: Props) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "Kanjivaram Silk",
    customCategory: "",
    isBestSeller: false,
    colors: [] as string[],
  });

  const set = (key: string, value: string | boolean | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleColor = (hex: string) => {
    set(
      "colors",
      form.colors.includes(hex)
        ? form.colors.filter((c) => c !== hex)
        : [...form.colors, hex]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast("Product name and price are required.", "error");
      return;
    }

    const finalCategory =
      form.category === "Other (custom)" && form.customCategory.trim()
        ? form.customCategory.trim()
        : form.category === "Other (custom)"
        ? "Uncategorised"
        : form.category;

    try {
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
          description: form.description,
          price: form.price,
          stock: form.stock,
          image: form.image,
          category: finalCategory,
          isBestSeller: form.isBestSeller,
          colors: form.colors,
          similarPieces: [],
        }),
      });

      if (res.ok) {
        showToast("Product added successfully!");
        setForm({
          name: "",
          slug: "",
          description: "",
          price: "",
          stock: "",
          image: "",
          category: "Kanjivaram Silk",
          customCategory: "",
          isBestSeller: false,
          colors: [],
        });
        onSuccess();
      } else {
        const err = await res.json();
        showToast(err.message || "Failed to create product", "error");
      }
    } catch {
      showToast("Server error occurred", "error");
    }
  };

  const field = (label: string, key: string, placeholder: string, type = "text") => (
    <div>
      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key as keyof typeof form] as string}
        onChange={(e) => set(key, e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
      />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-amber-100">Add New Saree</h2>
        <p className="text-sm text-neutral-400">
          Create a new product entry for your online saree catalogue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {field("Saree Name *", "name", "e.g. Kanjivaram Brocade Silk Saree")}
          {field("Custom Slug (Optional)", "slug", "auto-generated-from-name")}
        </div>

        {/* Category: dropdown + optional free-text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
            >
              {PRESET_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {form.category === "Other (custom)" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Your Category Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Ikkat, Jamdani, Sambalpuri..."
                value={form.customCategory}
                onChange={(e) => set("customCategory", e.target.value)}
                className="w-full bg-neutral-950 border border-amber-700/60 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-neutral-500 mt-1">This will be saved as the product category.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {field("Price (INR ₹) *", "price", "e.g. 12999", "number")}
          {field("Available Stock (Quantity)", "stock", "10", "number")}
        </div>

        {field("Image URL", "image", "https://images.unsplash.com/...")}

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Detailed Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe the fabric quality, zari work, occasion suitability..."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Available Colors <span className="text-neutral-500 normal-case">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SAREE_COLORS.map((color) => {
              const active = form.colors.includes(color.hex);
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => toggleColor(color.hex)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs border transition-all ${
                    active
                      ? "border-amber-500 text-amber-200 bg-amber-950/40"
                      : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.label}
                </button>
              );
            })}
          </div>
          {form.colors.length > 0 && (
            <p className="text-[10px] text-amber-500/70 mt-2">
              {form.colors.length} color{form.colors.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="bestSellerCheck"
            checked={form.isBestSeller}
            onChange={(e) => set("isBestSeller", e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded border-neutral-800"
          />
          <label htmlFor="bestSellerCheck" className="text-sm font-medium text-amber-200 cursor-pointer">
            Mark as Best Seller Saree
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-950/50 transition-all"
        >
          Publish Saree Product
        </button>
      </form>
    </div>
  );
}
