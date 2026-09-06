"use client";

import { mockProducts, mockCategories, mockBlouseFabrics } from "@/lib/mockData";
import Link from "next/link";
import { useState } from "react";

export default function ProductsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="font-headline-md md:font-headline-lg text-2xl md:text-headline-lg text-on-surface">All Products</h1>
          <p className="font-caption text-[11px] uppercase tracking-widest text-on-surface-variant mt-1">{mockProducts.length * 800}+ Curated Sarees</p>
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

        {/* Sidebar Filters - hidden on mobile unless toggled */}
        <aside className={`w-full lg:w-64 flex-shrink-0 ${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="bg-surface-container-lowest lg:bg-transparent rounded-lg p-4 lg:p-0 shadow-md lg:shadow-none">
            <div className="flex items-center justify-between pb-6 border-b border-outline-variant/30 mb-6">
              <h2 className="font-label-md text-xs uppercase tracking-widest text-on-surface">Filter</h2>
              <button className="lg:hidden" onClick={() => setFiltersOpen(false)}>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-label-md text-[11px] uppercase tracking-widest font-bold text-on-surface">Category</h3>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_less</span>
              </div>
              <div className="space-y-3">
                {mockCategories.map(cat => (
                  <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-outline-variant rounded-[2px] group-hover:border-primary transition-colors flex-shrink-0"></div>
                    <span className="font-body-md text-[13px] text-on-surface group-hover:text-primary transition-colors">
                      {cat.name} <span className="text-on-surface-variant text-[11px]">({cat.count.toLocaleString()})</span>
                    </span>
                  </label>
                ))}
              </div>
              <button className="mt-4 font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors">
                + Show more
              </button>
            </div>

            {/* Blouse Fabric Filter */}
            <div className="mb-8 border-t border-outline-variant/30 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-label-md text-[11px] uppercase tracking-widest font-bold text-on-surface">Blouse Fabric</h3>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_less</span>
              </div>
              <div className="space-y-3">
                {mockBlouseFabrics.map(fabric => (
                  <label key={fabric.name} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-outline-variant rounded-[2px] group-hover:border-primary transition-colors flex-shrink-0"></div>
                    <span className="font-body-md text-[13px] text-on-surface group-hover:text-primary transition-colors">
                      {fabric.name} <span className="text-on-surface-variant text-[11px]">({fabric.count.toLocaleString()})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest py-3 rounded-sm hover:bg-tertiary-container transition-colors">
              See 4841 items
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-container-low p-3 md:p-4 rounded-md mb-6 md:mb-8 gap-2">
            <div className="font-caption text-[10px] md:text-[11px] uppercase tracking-widest text-on-surface-variant">
              4896 Items
            </div>
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="font-label-md text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface group-hover:text-primary transition-colors">Featured</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary transition-colors">expand_more</span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {mockProducts.map((product) => (
              <div key={product.id} className="group flex flex-col relative bg-surface-container-lowest rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/5] overflow-hidden bg-surface-container relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Wishlist Button */}
                  <button className="absolute top-2 right-2 md:top-4 md:right-4 w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface/90 flex items-center justify-center text-on-surface-variant hover:text-primary shadow-sm transition-colors z-10 opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined text-[16px] md:text-[18px]">favorite</span>
                  </button>
                  {/* Tags */}
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1">
                    {product.tags.map(tag => (
                      <span key={tag} className="bg-primary text-on-primary px-1.5 py-0.5 text-[8px] md:text-[9px] font-label-md uppercase tracking-wider rounded-sm">{tag}</span>
                    ))}
                  </div>
                  {/* Quick View - desktop hover */}
                  <div className="absolute inset-x-0 bottom-0 pb-3 md:pb-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex">
                    <button className="bg-surface/95 text-on-surface font-label-md text-[9px] md:text-[10px] uppercase tracking-widest px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm flex items-center gap-1 md:gap-2 hover:bg-primary hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[13px] md:text-[14px]">shopping_bag</span>
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="text-center p-2 md:p-4 flex flex-col flex-1">
                  <h3 className="font-title-lg text-[12px] md:text-[15px] leading-tight text-on-surface mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-center items-center gap-1 md:gap-2 flex-wrap">
                    <p className="font-body-md text-[12px] md:text-sm text-on-surface font-semibold">₹{product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                      <p className="font-body-md text-[10px] md:text-xs text-on-surface-variant line-through">₹{product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                  {/* Mobile quick-add */}
                  <button className="mt-2 md:hidden text-[9px] font-label-md uppercase tracking-widest text-on-surface-variant border border-outline-variant/50 rounded-sm py-1 hover:bg-primary hover:text-on-primary hover:border-primary transition-all">
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
