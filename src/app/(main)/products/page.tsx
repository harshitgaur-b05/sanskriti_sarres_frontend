"use client";

import { useEffect, useState } from "react";
import { mockProducts } from "@/lib/mockData";
import { useCart } from "@/lib/CartContext";

interface Product {
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
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function getId(p: Product) {
  return p._id || p.id;
}

export default function ProductsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch((err) => console.error("Error fetching products", err))
      .finally(() => setLoading(false));
  }, []);

  // Build category list dynamically from real products
  const dynamicCategories = Array.from(new Set(products.map((p) => p.category))).sort();

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) =>
          p.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const displayList: (Product | typeof mockProducts[0])[] =
    products.length > 0 ? filteredProducts : mockProducts;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="font-headline-md md:font-headline-lg text-2xl md:text-headline-lg text-on-surface">
            All Products
          </h1>
          <p className="font-caption text-[11px] uppercase tracking-widest text-on-surface-variant mt-1">
            {displayList.length} Curated Sarees Available
          </p>
        </div>
        <button
          className="flex lg:hidden items-center gap-2 font-label-md text-xs uppercase tracking-widest text-on-surface border border-outline-variant px-3 py-2 rounded-sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <span className="material-symbols-outlined text-base">tune</span>
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters */}
        <aside
          className={`w-full lg:w-64 flex-shrink-0 ${filtersOpen ? "block" : "hidden"} lg:block`}
        >
          <div className="bg-surface-container-lowest lg:bg-transparent rounded-lg p-4 lg:p-0 shadow-md lg:shadow-none">
            <div className="flex items-center justify-between pb-6 border-b border-outline-variant/30 mb-6">
              <h2 className="font-label-md text-xs uppercase tracking-widest text-on-surface">
                Filter by Category
              </h2>
              <button className="lg:hidden" onClick={() => setFiltersOpen(false)}>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                  selectedCategory === "All"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                All Sarees
              </button>
              {/* Dynamic categories from DB */}
              {(dynamicCategories.length > 0
                ? dynamicCategories
                : ["Kanjivaram", "Banarasi", "Chanderi", "Bandhani", "Organza", "Tussar", "Bridal", "Patola", "Linen", "Paithani"]
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20 text-on-surface-variant animate-pulse">
              Loading catalog...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayList.map((product: any) => {
                const pid = getId(product) || product.id;
                return (
                  <div
                    key={pid}
                    className="group bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-outline-variant/30"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                      <img
                        src={
                          product.image ||
                          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-on-primary px-2.5 py-1 text-[9px] font-label-md uppercase tracking-wider rounded-sm font-semibold">
                          {product.category}
                        </span>
                      </div>
                      {product.isBestSeller && (
                        <div className="absolute top-3 right-3 bg-amber-600 text-white px-2 py-0.5 text-[9px] font-bold rounded">
                          BEST SELLER
                        </div>
                      )}
                      {/* Quick add overlay */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
                        <button
                          onClick={() =>
                            addToCart({
                              id: pid,
                              name: product.name,
                              price: Number(product.price),
                              image: product.image,
                              category: product.category,
                            })
                          }
                          className="w-full py-2.5 bg-primary text-on-primary text-xs font-label-md uppercase tracking-widest rounded-sm shadow-lg hover:bg-tertiary-container transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 text-center">
                      <span className="text-[10px] font-caption text-on-surface-variant uppercase tracking-widest mb-1">
                        {product.category}
                      </span>
                      <h3 className="font-headline-md text-base text-on-surface mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                        {product.description}
                      </p>

                      {/* Color swatches */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center justify-center gap-1.5 mb-3">
                          {product.colors.map((hex: string) => (
                            <span
                              key={hex}
                              className="w-3.5 h-3.5 rounded-full border border-outline-variant/50"
                              style={{ backgroundColor: hex }}
                              title={hex}
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto gap-2">
                        <span className="font-body-md text-base font-bold text-on-surface">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() =>
                            addToCart({
                              id: pid,
                              name: product.name,
                              price: Number(product.price),
                              image: product.image,
                              category: product.category,
                            })
                          }
                          className="text-xs px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-sm transition-colors font-label-md uppercase tracking-wider"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
