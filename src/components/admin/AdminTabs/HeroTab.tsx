"use client";

import React, { useState, useEffect } from "react";
import HeroCarousel from "@/components/HeroCarousel";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const DEFAULT_FALLBACK_IMAGES = [
  "/screen.png",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=1600"
];

interface Props {
  initialImageUrl?: string;
  initialImages?: string[];
  initialInterval?: number;
  showToast: (msg: string, type?: "success" | "error") => void;
  onRefreshHero?: () => void;
}

export default function HeroTab({
  initialImageUrl = "",
  initialImages = [],
  initialInterval = 4000,
  showToast,
  onRefreshHero,
}: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [intervalMs, setIntervalMs] = useState<number>(4000);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
    } else if (initialImageUrl) {
      setImages([initialImageUrl]);
    } else {
      setImages(DEFAULT_FALLBACK_IMAGES);
    }
    if (initialInterval) {
      setIntervalMs(initialInterval);
    }
  }, [initialImages, initialImageUrl, initialInterval]);

  // Handle adding an image by URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, trimmed]);
    setUrlInput("");
    showToast("Image URL added to slide queue.");
  };

  const [isUploading, setIsUploading] = useState(false);

  // Handle file uploads to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsUploading(true);
    showToast("Uploading image(s) to Cloudinary...", "success");

    const uploadedUrls: string[] = [];

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
            uploadedUrls.push(data.url);
          }
        } else {
          showToast(`Failed to upload ${file.name} to Cloudinary`, "error");
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        showToast(`Uploaded ${uploadedUrls.length} image(s) to Cloudinary successfully!`);
      }
    } catch (error) {
      console.error(error);
      showToast("Cloudinary upload failed", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Move slide position up or down
  const moveImage = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImages(updated);
  };

  // Remove slide
  const removeImage = (index: number) => {
    if (images.length <= 1) {
      if (!confirm("Removing all images will revert the hero section to default sample banners. Continue?")) return;
    }
    setImages((prev) => prev.filter((_, idx) => idx !== index));
    showToast("Image removed from carousel queue.");
  };

  // Save Carousel Configuration
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const finalImages = images.length > 0 ? images : DEFAULT_FALLBACK_IMAGES;
      const res = await fetch(`${BACKEND_URL}/api/admin/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: finalImages[0],
          images: finalImages,
          imageUrls: finalImages,
          interval: intervalMs,
        }),
      });

      if (res.ok) {
        showToast("Hero section carousel updated successfully!");
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
          Hero Banner Carousel Management
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Upload and manage multiple showcase slides for your home page hero section. Banner slides auto-scroll smoothly for visiting customers.
        </p>
      </div>

      {/* Main Admin Form */}
      <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-8">
        
        {/* Upload & Add Controls */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            1. Add New Banner Images
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Box */}
            <div className="border-2 border-dashed border-neutral-700 hover:border-amber-500/70 bg-neutral-950/70 rounded-xl p-5 text-center transition-all flex flex-col items-center justify-center cursor-pointer group">
              <span className="material-symbols-outlined text-3xl text-neutral-400 group-hover:text-amber-400 transition-colors">
                cloud_upload
              </span>
              <span className="text-xs font-semibold text-neutral-200 mt-2">
                Upload Image Files
              </span>
              <span className="text-[11px] text-neutral-500 mt-1">
                Uploads directly to Cloudinary (cloud: pkpfahlo)
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
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-300 block mb-1">
                  Add Image via Direct URL
                </span>
                <span className="text-[11px] text-neutral-500 block mb-3">
                  Paste link to hosted image (Cloudinary, Unsplash, etc.)
                </span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddUrl}
                className="mt-3 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/20 text-xs rounded-lg font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add URL to Carousel
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

        {/* Active Image Queue & Reordering */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              3. Current Hero Carousel Slides ({images.length})
            </label>
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset to default curated saree banners?")) {
                  setImages(DEFAULT_FALLBACK_IMAGES);
                  showToast("Reverted to default banners.");
                }
              }}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">restart_alt</span>
              Reset Defaults
            </button>
          </div>

          {images.length === 0 ? (
            <div className="p-8 border border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
              No images in queue. The site will display default curated saree banners.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 flex items-center gap-3 group relative"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-14 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-800">
                    <img
                      src={imgUrl}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-amber-400 tracking-wider block">
                      Slide #{index + 1} {index === 0 && "(Cover)"}
                    </span>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5" title={imgUrl}>
                      {imgUrl.startsWith("data:") ? "Uploaded Image (Data URL)" : imgUrl}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveImage(index, "up")}
                      className="w-7 h-7 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                      title="Move Up"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, "down")}
                      className="w-7 h-7 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                      title="Move Down"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_downward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="w-7 h-7 rounded bg-rose-950/50 hover:bg-rose-900 text-rose-300 flex items-center justify-center"
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
            Live Homepage Carousel Preview
          </span>
          <div className="rounded-2xl overflow-hidden border border-neutral-800 relative bg-neutral-950 shadow-2xl">
            <HeroCarousel images={images} interval={intervalMs} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-semibold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">save</span>
          {isSaving ? "Saving Carousel to MongoDB..." : "Save Hero Carousel Configuration"}
        </button>
      </form>
    </div>
  );
}
