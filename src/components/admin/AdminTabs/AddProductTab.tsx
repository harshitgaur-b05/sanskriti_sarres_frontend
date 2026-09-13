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
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    image: "",
    category: "Kanjivaram Silk",
    customCategory: "",
    isBestSeller: false,
    colors: [] as string[],
    sku: "",
    occasion: "",
    washCare: "",
    sareeDimension: "",
    blouseType: "",
    blouseDimension: "",
    craft: "",
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
          originalPrice: form.originalPrice || undefined,
          stock: form.stock,
          image: form.image,
          category: finalCategory,
          isBestSeller: form.isBestSeller,
          colors: form.colors,
          similarPieces: [],
          sku: form.sku,
          occasion: form.occasion,
          washCare: form.washCare,
          sareeDimension: form.sareeDimension,
          blouseType: form.blouseType,
          blouseDimension: form.blouseDimension,
          craft: form.craft,
        }),
      });

      if (res.ok) {
        showToast("Product added successfully!");
        setForm({
          name: "",
          slug: "",
          description: "",
          price: "",
          originalPrice: "",
          stock: "",
          image: "",
          category: "Kanjivaram Silk",
          customCategory: "",
          isBestSeller: false,
          colors: [],
          sku: "",
          occasion: "",
          washCare: "",
          sareeDimension: "",
          blouseType: "",
          blouseDimension: "",
          craft: "",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {field("Selling Price (₹) *", "price", "e.g. 9999", "number")}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Original MRP (₹)
              <span className="ml-1 text-neutral-500 normal-case text-[10px]">for discount display</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 12999"
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
            />
            {form.price && form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
              <p className="text-[10px] text-amber-500 mt-1">
                {Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)}% discount will be shown
              </p>
            )}
          </div>
          {field("Stock (Quantity)", "stock", "10", "number")}
        </div>

        {/* V1 Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-neutral-800 pt-6 mt-4">
          <h3 className="md:col-span-2 text-sm font-bold text-amber-100">Product Specifications</h3>
          {field("SKU", "sku", "e.g. SAPP01AC3588")}
          {field("Occasion", "occasion", "e.g. Festive Wear")}
          {field("Wash Care", "washCare", "e.g. Dry Clean")}
          {field("Craft", "craft", "e.g. Woven")}
          {field("Saree Dimension", "sareeDimension", "e.g. 5.3 m x 1.1 m")}
          {field("Blouse Type", "blouseType", "e.g. Unstitched Blouse Piece")}
          {field("Blouse Dimension", "blouseDimension", "e.g. 70 cm x 1.1 m")}
        </div>

        {/* Image URL & Cloudinary Upload */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Product Image (URL or Cloudinary Upload)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
            />
            <label
              htmlFor="product-image-upload"
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/20 text-xs rounded-xl font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-base">cloud_upload</span>
              {isUploading ? "Uploading to Cloudinary..." : "Upload to Cloudinary"}
            </label>
            <input
              id="product-image-upload"
              type="file"
              accept="image/*"
              disabled={isUploading}
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsUploading(true);
                showToast("Uploading product image to Cloudinary...", "success");
                try {
                  const base64Data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                  const res = await fetch(`${BACKEND_URL}/api/upload`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Data, folder: "sanskriti_products" }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.url) {
                      set("image", data.url);
                      showToast("Uploaded to Cloudinary successfully!");
                    }
                  } else {
                    showToast("Failed to upload image to Cloudinary", "error");
                  }
                } catch (err) {
                  console.error(err);
                  showToast("Cloudinary upload failed", "error");
                } finally {
                  setIsUploading(false);
                  e.target.value = "";
                }
              }}
            />
          </div>
          {form.image && (
            <div className="mt-3 flex items-center gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
              <img src={form.image} alt="Product Preview" className="w-12 h-12 object-cover rounded-lg border border-neutral-800" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">Image Preview Attached</span>
                <p className="text-xs text-neutral-400 truncate">{form.image}</p>
              </div>
            </div>
          )}
        </div>

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
            
            {/* Display Custom Colors */}
            {form.colors.filter(c => !c.startsWith("#")).map(customColor => (
              <button
                key={customColor}
                type="button"
                onClick={() => set("colors", form.colors.filter((c) => c !== customColor))}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs border transition-all border-amber-500 text-amber-200 bg-amber-950/40"
              >
                <span className="material-symbols-outlined text-[12px]">close</span>
                {customColor}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="Add custom color name..."
              value={(form as any).customColorText || ""}
              onChange={(e) => set("customColorText", e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => {
                const text = (form as any).customColorText;
                if (text && text.trim() && !form.colors.includes(text.trim())) {
                  set("colors", [...form.colors, text.trim()]);
                  set("customColorText", "");
                }
              }}
              className="px-3 py-1.5 bg-neutral-800 text-amber-400 text-xs rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Add Color
            </button>
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
