"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { mockProducts } from "@/lib/mockData";
import { useCart } from "@/lib/CartContext";

interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  image?: string;
  category: string;
  isBestSeller?: boolean;
  colors?: string[];
  tags?: string[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const MIN_PRICE = 0;
const MAX_PRICE = 150000;

const SAREE_COLORS = [
  { name: "Red", hex: "#C62828" },
  { name: "Maroon", hex: "#7B1C1C" },
  { name: "Pink", hex: "#E91E8C" },
  { name: "Rose", hex: "#F48FB1" },
  { name: "Orange", hex: "#E65100" },
  { name: "Gold", hex: "#B8860B" },
  { name: "Yellow", hex: "#F9A825" },
  { name: "Green", hex: "#2E7D32" },
  { name: "Teal", hex: "#00695C" },
  { name: "Blue", hex: "#1565C0" },
  { name: "Navy", hex: "#0D1B4E" },
  { name: "Purple", hex: "#6A1B9A" },
  { name: "Violet", hex: "#4527A0" },
  { name: "Cream", hex: "#F5F0E8" },
  { name: "White", hex: "#FAFAFA" },
  { name: "Black", hex: "#1A1A1A" },
];

function getId(p: Product) {
  return p._id || p.id;
}

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

// Price range dual-thumb slider
function PriceRangeSlider({
  min, max, value, onChange,
}: {
  min: number; max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), value[1] - 500);
    onChange([v, value[1]]);
  };
  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), value[0] + 500);
    onChange([value[0], v]);
  };

  return (
    <div className="px-1">
      {/* Track */}
      <div className="relative h-1.5 rounded-full bg-outline-variant/40 my-4">
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
      </div>
      {/* Inputs stacked */}
      <div className="relative h-5">
        <input
          type="range" min={min} max={max} step={500}
          value={value[0]}
          onChange={handleMin}
          className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface-container-lowest [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-runnable-track]:bg-transparent"
        />
        <input
          type="range" min={min} max={max} step={500}
          value={value[1]}
          onChange={handleMax}
          className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface-container-lowest [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-runnable-track]:bg-transparent"
        />
      </div>
      <div className="flex justify-between mt-3">
        <span className="font-label-md text-[11px] text-on-surface bg-surface-container px-2 py-1 rounded">
          {formatINR(value[0])}
        </span>
        <span className="font-label-md text-[11px] text-on-surface bg-surface-container px-2 py-1 rounded">
          {formatINR(value[1])}
        </span>
      </div>
    </div>
  );
}

// Collapsible filter section
function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-outline-variant/20 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-on-surface group-hover:text-primary transition-colors">
          {title}
        </span>
        <span className="material-symbols-outlined text-sm text-on-surface-variant transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          expand_more
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function ProductsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [sortBy, setSortBy] = useState("featured");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (data?.length > 0) setProducts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allProducts: Product[] = products.length > 0
    ? products
    : (mockProducts as unknown as Product[]);

  const categories = Array.from(new Set(allProducts.map((p) => p.category))).sort();

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const toggleColor = (color: string) =>
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
  };

  const hasFilters = selectedCategories.length > 0 || selectedColors.length > 0
    || priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE;

  // Filter + sort
  let filtered = allProducts.filter((p) => {
    const catMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    const colorMatch = selectedColors.length === 0 || (
      p.colors && selectedColors.some((c) => p.colors!.includes(c))
    );
    return catMatch && priceMatch && colorMatch;
  });

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const Sidebar = () => (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-label-md text-[11px] uppercase tracking-[0.25em] text-on-surface">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="font-label-md text-[10px] uppercase tracking-wider text-on-tertiary-container hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <span
                className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
                  selectedCategories.includes(cat)
                    ? "bg-primary border-primary"
                    : "border-outline-variant group-hover:border-on-surface"
                }`}
                onClick={() => toggleCategory(cat)}
              >
                {selectedCategories.includes(cat) && (
                  <span className="material-symbols-outlined text-on-primary" style={{ fontSize: "10px" }}>check</span>
                )}
              </span>
              <span
                onClick={() => toggleCategory(cat)}
                className={`font-body-md text-xs transition-colors ${
                  selectedCategories.includes(cat) ? "text-on-surface font-semibold" : "text-on-surface-variant group-hover:text-on-surface"
                }`}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <PriceRangeSlider
          min={MIN_PRICE} max={MAX_PRICE}
          value={priceRange}
          onChange={setPriceRange}
        />
        {/* Quick range presets */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {[
            { label: "Under ₹10k", range: [0, 10000] as [number, number] },
            { label: "₹10k–₹25k", range: [10000, 25000] as [number, number] },
            { label: "₹25k–₹50k", range: [25000, 50000] as [number, number] },
            { label: "₹50k+", range: [50000, MAX_PRICE] as [number, number] },
          ].map((preset) => {
            const active = priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1];
            return (
              <button
                key={preset.label}
                onClick={() => setPriceRange(active ? [MIN_PRICE, MAX_PRICE] : preset.range)}
                className={`text-[10px] font-label-md px-2.5 py-1 border transition-colors ${
                  active
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-on-surface hover:text-on-surface"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="grid grid-cols-4 gap-2">
          {SAREE_COLORS.map((color) => {
            const selected = selectedColors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                title={color.name}
                className="flex flex-col items-center gap-1 group"
              >
                <span
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selected ? "border-primary scale-110 shadow-md" : "border-outline-variant/40 group-hover:border-on-surface-variant"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className={`font-label-md text-[8px] text-center leading-tight ${selected ? "text-on-surface font-semibold" : "text-on-surface-variant"}`}>
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Page Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">Sankriti Archives</span>
              <h1 className="font-headline-md md:font-headline-lg text-3xl md:text-headline-lg text-on-surface mt-1 leading-none">
                All Sarees
              </h1>
              <p className="font-body-md text-xs text-on-surface-variant mt-1.5">
                {filtered.length} curated handlooms
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-outline-variant text-on-surface text-xs font-label-md uppercase tracking-wider hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                Filters {hasFilters && <span className="bg-primary text-on-primary rounded-full w-4 h-4 text-[9px] flex items-center justify-center">{selectedCategories.length + selectedColors.length}</span>}
              </button>
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant hidden sm:block">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-outline-variant bg-surface-container-lowest text-on-surface text-xs font-label-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pr-7 cursor-pointer"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23444' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-outline-variant/20">
              {selectedCategories.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-on-primary text-[10px] font-label-md uppercase tracking-wider">
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="hover:opacity-70">
                    <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>close</span>
                  </button>
                </span>
              ))}
              {selectedColors.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container border border-outline-variant text-on-surface text-[10px] font-label-md uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SAREE_COLORS.find((x) => x.name === c)?.hex }} />
                  {c}
                  <button onClick={() => toggleColor(c)} className="hover:opacity-70">
                    <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>close</span>
                  </button>
                </span>
              ))}
              {(priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container border border-outline-variant text-on-surface text-[10px] font-label-md uppercase tracking-wider">
                  {formatINR(priceRange[0])} – {formatINR(priceRange[1])}
                  <button onClick={() => setPriceRange([MIN_PRICE, MAX_PRICE])} className="hover:opacity-70">
                    <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>close</span>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-surface-container-lowest shadow-2xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-lg text-on-surface">Filters</h2>
              <button onClick={() => setDrawerOpen(false)}>
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <Sidebar />
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-6 w-full py-3 bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest"
            >
              View {filtered.length} Results
            </button>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-10">
        <div className="flex gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-6">
              <Sidebar />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-surface-container-high rounded-sm mb-3" />
                    <div className="h-3 bg-surface-container-high rounded mb-2 w-3/4" />
                    <div className="h-3 bg-surface-container rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">search_off</span>
                <p className="font-headline-md text-lg text-on-surface mb-2">No sarees found</p>
                <p className="text-sm text-on-surface-variant mb-6">Try adjusting your filters</p>
                <button onClick={clearAll} className="px-6 py-2 bg-primary text-on-primary text-xs font-label-md uppercase tracking-widest">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((product) => {
                  const pid = getId(product);
                  const slug = product.slug || pid;
                  const isHovered = hoveredId === pid;
                  return (
                    <div
                      key={pid}
                      className="group flex flex-col"
                      onMouseEnter={() => setHoveredId(pid)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Image */}
                      <Link href={`/products/${slug}`} className="block relative overflow-hidden bg-surface-container">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img
                            src={product.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {product.isBestSeller && (
                            <span className="bg-[#8B1A1A] text-white px-2 py-0.5 text-[9px] font-label-md uppercase tracking-wider">
                              Best Seller
                            </span>
                          )}
                          {product.tags?.includes("New Arrival") && (
                            <span className="bg-primary text-on-primary px-2 py-0.5 text-[9px] font-label-md uppercase tracking-wider">
                              New
                            </span>
                          )}
                        </div>
                        {/* Wishlist */}
                        <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-surface-container-lowest/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container">
                          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px" }}>favorite_border</span>
                        </button>
                        {/* Quick add */}
                        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({ id: pid, name: product.name, price: Number(product.price), image: product.image, category: product.category });
                            }}
                            className="w-full py-3 bg-[#8B1A1A] text-white text-[10px] font-label-md uppercase tracking-[0.2em] hover:bg-[#6B1414] transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>shopping_bag</span>
                            Add to Bag
                          </button>
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="pt-3 flex flex-col gap-0.5">
                        <span className="font-label-md text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">
                          {product.category}
                        </span>
                        <Link href={`/products/${slug}`} className="font-headline-md text-sm text-on-surface hover:text-primary transition-colors line-clamp-1 leading-snug">
                          {product.name}
                        </Link>
                        {/* Color dots */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {product.colors.slice(0, 5).map((hex) => (
                              <span key={hex} className="w-3 h-3 rounded-full border border-outline-variant/40" style={{ backgroundColor: hex }} />
                            ))}
                          </div>
                        )}
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="font-body-md text-sm font-semibold text-on-surface">
                            {formatINR(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="font-body-md text-xs text-on-surface-variant line-through">
                              {formatINR(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <p className="font-label-md text-[10px] text-on-surface-variant mt-0.5">
                          Incl. of all taxes
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
