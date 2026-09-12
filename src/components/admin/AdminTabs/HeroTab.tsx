"use client";

import React, { useState, useEffect } from "react";
import HeroCarousel, { HeroSlide } from "@/components/HeroCarousel";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface HeroSlideItem {
  imageUrl: string;
  targetUrl: string;
}

interface Props {
  initialImageUrl?: string;
  initialImages?: string[];
  initialSlides?: HeroSlideItem[];
  initialInterval?: number;
  showToast: (msg: string, type?: "success" | "error") => void;
  onRefreshHero?: () => void;
}

export default function HeroTab({
  initialImageUrl = "",
  initialImages = [],
  initialSlides = [],
  initialInterval = 4000,
  showToast,
  onRefreshHero,
}: Props) {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [targetUrlInput, setTargetUrlInput] = useState("/products");
  const [intervalMs, setIntervalMs] = useState<number>(4000);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides);
    } else if (initialImages && initialImages.length > 0) {
      setSlides(initialImages.map((img) => ({ imageUrl: img, targetUrl: "/products" })));
    } else if (initialImageUrl) {
      setSlides([{ imageUrl: initialImageUrl, targetUrl: "/products" }]);
    } else {
      setSlides([]);
    }
    if (initialInterval) {
      setIntervalMs(initialInterval);
    }
  }, [initialSlides, initialImages, initialImageUrl, initialInterval]);

  // Handle adding an image by URL with a target URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedImg = urlInput.trim();
    const trimmedTarget = targetUrlInput.trim() || "/products";
    if (!trimmedImg) return;
    setSlides((prev) => [...prev, { imageUrl: trimmedImg, targetUrl: trimmedTarget }]);
    setUrlInput("");
    setTargetUrlInput("/products");
    showToast("Image banner slide added to queue.");
  };

  // Handle file uploads to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsUploading(true);
    showToast("Uploading image(s) to Cloudinary...", "success");

    const newSlides: HeroSlideItem[] = [];

    try {
      for (const file of fileList) {
        // Read as Data URL
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to Cloudinary API
        const res = await fetch(`${BACKEND_URL}/api/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Data, folder: "sanskriti_hero" }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            newSlides.push({ imageUrl: data.url, targetUrl: "/products" });
          }
        } else {
          showToast(`Failed to upload ${file.name} to Cloudinary`, "error");
        }
      }

      if (newSlides.length > 0) {
        setSlides((prev) => [...prev, ...newSlides]);
        showToast(`Uploaded ${newSlides.length} image(s) to Cloudinary successfully!`);
      }
    } catch (error) {
      console.error(error);
      showToast("Cloudinary upload failed", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Update target URL for a specific slide
  const updateSlideTargetUrl = (index: number, newTargetUrl: string) => {
    setSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], targetUrl: newTargetUrl };
      return updated;
    });
  };

  // Move slide position up or down
  const moveSlide = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSlides(updated);
  };

  // Remove slide
  const removeSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, idx) => idx !== index));
    showToast("Slide removed from carousel queue.");
  };

  // Save Carousel Configuration
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const finalSlides = slides;
      const imagesList = finalSlides.map((s) => s.imageUrl);

      const res = await fetch(`${BACKEND_URL}/api/admin/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imagesList[0] || "",
          images: imagesList,
          imageUrls: imagesList,
          slides: finalSlides,
          interval: intervalMs,
        }),
      });

      if (res.ok) {
        showToast("Hero section banners and target URLs saved successfully!");
        if (onRefreshHero) onRefreshHero();
      } else {
        showToast("Failed to update hero carousel", "error");
      }
    } catch {
      showToast("Failed to update hero carousel", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-amber-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">view_carousel</span>
          Hero Banner Carousel & Click URL Management
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Upload banner images, set custom click target URLs for each slide, and configure auto-scroll speed for your home page hero section.
        </p>
      </div>

      {/* Main Admin Form */}
      <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-8">
        
        {/* Upload & Add Controls */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            1. Add New Banner Slide
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Box */}
            <div className="border-2 border-dashed border-neutral-700 hover:border-amber-500/70 bg-neutral-950/70 rounded-xl p-5 text-center transition-all flex flex-col items-center justify-center cursor-pointer group">
              <span className="material-symbols-outlined text-3xl text-neutral-400 group-hover:text-amber-400 transition-colors">
                cloud_upload
              </span>
              <span className="text-xs font-semibold text-neutral-200 mt-2">
                Upload Banner Image Files
              </span>
              <span className="text-[11px] text-neutral-500 mt-1">
                Uploads directly to Cloudinary (Default target: /products)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="hero-file-input"
              />
              <label
                htmlFor="hero-file-input"
                className={`mt-3 px-4 py-2 text-xs rounded-lg font-medium cursor-pointer transition-colors ${
                  isUploading
                    ? "bg-amber-600/30 text-amber-300 cursor-wait"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                }`}
              >
                {isUploading ? "Uploading to Cloudinary..." : "Browse & Upload to Cloudinary"}
              </label>
            </div>

            {/* URL Input Box */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-semibold text-neutral-300 block mb-1">
                  Add Image via Direct URL
                </span>
                <input
                  type="url"
                  placeholder="Image URL (e.g. https://...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500 mb-2"
                />

                <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Click Target Navigation URL:
                </span>
                <input
                  type="text"
                  placeholder="/products or /products/category/kanjivaram"
                  value={targetUrlInput}
                  onChange={(e) => setTargetUrlInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAddUrl}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/20 text-xs rounded-lg font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Slide to Carousel
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Speed Selector */}
        <div className="border-t border-neutral-800 pt-6">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            2. Auto-Scroll Speed
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {[3000, 4000, 5000, 6000].map((ms) => (
              <button
                key={ms}
                type="button"
                onClick={() => setIntervalMs(ms)}
                className={`px-4 py-2 text-xs rounded-lg font-medium border transition-all ${
                  intervalMs === ms
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {ms / 1000} Seconds {ms === 4000 && "(Recommended)"}
              </button>
            ))}
          </div>
        </div>

        {/* Active Slide Queue & Target URL Configurator */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              3. Current Hero Slides ({slides.length}) & Click Target URLs
            </label>
            {slides.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear all slides from queue?")) {
                    setSlides([]);
                    showToast("Cleared all slides.");
                  }
                }}
                className="text-xs text-red-400 hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">delete_sweep</span>
                Clear All Slides
              </button>
            )}
          </div>

          {slides.length === 0 ? (
            <div className="p-8 border border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
              No slides in queue. Add image URLs or upload images above to create slides.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center gap-3 group relative"
                >
                  {/* Thumbnail & Index */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                      <img
                        src={slide.imageUrl}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-amber-500 text-neutral-950 font-bold text-[9px] px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Target Link & Image URL Controls */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase text-amber-400 tracking-wider">
                        Target Click URL:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {["/products", "/products?category=kanjivaram", "/blogs", "/admin"].map((quickUrl) => (
                          <button
                            key={quickUrl}
                            type="button"
                            onClick={() => updateSlideTargetUrl(index, quickUrl)}
                            className={`text-[9px] px-2 py-0.5 rounded transition-all ${
                              slide.targetUrl === quickUrl
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                                : "bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
                            }`}
                          >
                            {quickUrl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-neutral-400">link</span>
                      <input
                        type="text"
                        value={slide.targetUrl || "/products"}
                        onChange={(e) => updateSlideTargetUrl(index, e.target.value)}
                        placeholder="Target URL (e.g. /products or /products/category/kanjivaram)"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Move & Delete Actions */}
                  <div className="flex items-center justify-end gap-1 flex-shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSlide(index, "up")}
                      className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border border-neutral-800"
                      title="Move Up"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={() => moveSlide(index, "down")}
                      className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border border-neutral-800"
                      title="Move Down"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_downward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSlide(index)}
                      className="w-8 h-8 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 flex items-center justify-center border border-rose-900/40"
                      title="Remove Slide"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Admin Interactive Carousel Preview */}
        <div className="border-t border-neutral-800 pt-6">
          <span className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
            Live Homepage Carousel Preview (Click Image to Test Target Link)
          </span>
          <div className="rounded-2xl overflow-hidden border border-neutral-800 relative bg-neutral-950 shadow-2xl">
            <HeroCarousel slides={slides} interval={intervalMs} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-semibold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">save</span>
          {isSaving ? "Saving Carousel & Target URLs to MongoDB..." : "Save Hero Carousel Configuration"}
        </button>
      </form>
    </div>
  );
}
