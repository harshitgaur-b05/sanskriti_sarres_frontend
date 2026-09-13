"use client";

import React, { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category: string;
  isBestSeller?: boolean;
  colors?: string[];
  similarPieces?: string[];
}

interface Props {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
  onAddProduct: () => void;
  onSeedProducts: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
interface EditModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onSaved: () => void;
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
  "Other",
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

function EditModal({ product, allProducts, onClose, onSaved, showToast }: EditModalProps) {
  const getId = (p: Product) => p._id || p.id;
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    image: product.image || "",
    category: PRESET_CATEGORIES.includes(product.category) ? product.category : "Other",
    customCategory: PRESET_CATEGORIES.includes(product.category) ? "" : product.category,
    isBestSeller: product.isBestSeller || false,
    colors: product.colors || [],
    similarPieces: product.similarPieces || [],
  });

  const set = (key: string, val: string | boolean | string[]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const toggleColor = (hex: string) => {
    set(
      "colors",
      form.colors.includes(hex)
        ? form.colors.filter((c) => c !== hex)
        : [...form.colors, hex]
    );
  };

  const toggleSimilar = (id: string) => {
    set(
      "similarPieces",
      form.similarPieces.includes(id)
        ? form.similarPieces.filter((s) => s !== id)
        : [...form.similarPieces, id]
    );
  };

  const handleSave = async () => {
    const finalCategory =
      form.category === "Other" && form.customCategory.trim()
        ? form.customCategory.trim()
        : form.category;

    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${getId(product)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image,
          category: finalCategory,
          isBestSeller: form.isBestSeller,
          colors: form.colors,
          similarPieces: form.similarPieces,
        }),
      });
      if (res.ok) {
        showToast("Product updated!");
        onSaved();
        onClose();
      } else {
        const err = await res.json();
        showToast(err.message || "Failed to update", "error");
      }
    } catch {
      showToast("Server error", "error");
    }
  };

  const otherProducts = allProducts.filter((p) => getId(p) !== getId(product));

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-lg font-serif font-bold text-amber-100">Edit Saree</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              >
                {PRESET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {form.category === "Other" && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Custom Category</label>
                <input
                  value={form.customCategory}
                  onChange={(e) => set("customCategory", e.target.value)}
                  placeholder="e.g. Ikkat, Jamdani..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Image (URL or Cloudinary Upload)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              />
              <label
                htmlFor="edit-product-image-upload"
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/20 text-xs rounded-xl font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                {isUploading ? "Uploading..." : "Cloudinary Upload"}
              </label>
              <input
                id="edit-product-image-upload"
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
              <div className="mt-2 flex items-center gap-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                <img src={form.image} alt="Preview" className="w-10 h-10 object-cover rounded-md border border-neutral-800" />
                <span className="text-xs text-neutral-400 truncate">{form.image}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Available Colors <span className="text-neutral-500 normal-case">(click to toggle)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SAREE_COLORS.map((color) => {
                const active = form.colors.includes(color.hex);
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => toggleColor(color.hex)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
                      active
                        ? "border-amber-500 text-amber-200 bg-amber-950/40"
                        : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    }`}
                    title={color.label}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
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
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all border-amber-500 text-amber-200 bg-amber-950/40"
                >
                  <span className="material-symbols-outlined text-[10px]">close</span>
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
              <p className="text-[10px] text-neutral-500 mt-2">
                Selected: {form.colors.map((h) => SAREE_COLORS.find((c) => c.hex === h)?.label || h).join(", ")}
              </p>
            )}
          </div>

          {/* Similar Pieces */}
          {otherProducts.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Similar Pieces <span className="text-neutral-500 normal-case">(select related products)</span>
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {otherProducts.map((p) => {
                  const pid = getId(p);
                  const checked = form.similarPieces.includes(pid);
                  return (
                    <label
                      key={pid}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        checked ? "bg-amber-950/30 border border-amber-700/40" : "bg-neutral-800/50 hover:bg-neutral-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSimilar(pid)}
                        className="accent-amber-500"
                      />
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=60"}
                        alt={p.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-xs text-neutral-200 line-clamp-1 flex-1">{p.name}</span>
                      <span className="text-xs text-amber-400">₹{Number(p.price).toLocaleString("en-IN")}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Best Seller */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="editBestSeller"
              checked={form.isBestSeller}
              onChange={(e) => set("isBestSeller", e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            <label htmlFor="editBestSeller" className="text-sm text-amber-200 cursor-pointer">Mark as Best Seller</label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ProductsTab ──────────────────────────────────────────────────────────
export default function ProductsTab({
  products,
  loading,
  onRefresh,
  onAddProduct,
  onSeedProducts,
  showToast,
}: Props) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const getId = (p: Product) => p._id || p.id;

  const toggleBestSeller = async (product: Product) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${getId(product)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBestSeller: !product.isBestSeller }),
      });
      if (res.ok) {
        showToast(`Updated Best Seller status for ${product.name}`);
        onRefresh();
      }
    } catch {
      showToast("Error updating product", "error");
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${getId(product)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Product deleted successfully");
        onRefresh();
      }
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-amber-100">Saree Catalog</h2>
          <p className="text-sm text-neutral-400">
            Manage all listed sarees, prices, categories, and best seller tags.
          </p>
        </div>
        <button
          onClick={onAddProduct}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-xl shadow-lg transition-all"
        >
          + Add New Saree
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400 animate-pulse">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-12 text-center">
          <p className="text-neutral-400 mb-4">No saree products found in database.</p>
          <button
            onClick={onSeedProducts}
            className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl"
          >
            Seed 10 Sample Sarees
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={getId(p)}
              className="bg-neutral-900 border border-neutral-800/80 hover:border-amber-700/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 bg-neutral-950 overflow-hidden group">
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 border border-amber-500/20">
                    {p.category}
                  </div>
                  {p.isBestSeller && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      ★ Best Seller
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold text-neutral-100 mb-1">{p.name}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{p.description}</p>

                  {/* Color swatches */}
                  {p.colors && p.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      {p.colors.map((hex) => (
                        <span
                          key={hex}
                          className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-amber-400">
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-neutral-500">Stock: {p.stock} units</span>
                  </div>

                  {/* Similar pieces count */}
                  {p.similarPieces && p.similarPieces.length > 0 && (
                    <p className="text-[10px] text-neutral-600 mt-1">
                      {p.similarPieces.length} similar piece{p.similarPieces.length > 1 ? "s" : ""} linked
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-neutral-800/60 mt-4 gap-2 flex-wrap">
                <button
                  onClick={() => toggleBestSeller(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    p.isBestSeller
                      ? "bg-amber-950/60 border-amber-600 text-amber-300 hover:bg-amber-900/60"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {p.isBestSeller ? "★ Best Seller" : "Set Best Seller"}
                </button>
                <button
                  onClick={() => setEditingProduct(p)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-amber-950/40 hover:border-amber-700 hover:text-amber-300 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProduct && (
        <EditModal
          product={editingProduct}
          allProducts={products}
          onClose={() => setEditingProduct(null)}
          onSaved={onRefresh}
          showToast={showToast}
        />
      )}
    </div>
  );
}
