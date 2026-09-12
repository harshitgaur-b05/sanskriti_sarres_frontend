"use client";

import React, { useState, useEffect } from "react";
import HeroCarousel, { HeroSlide } from "@/components/HeroCarousel";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface HeroSlideItem {
  imageUrl: string;
  mobileImageUrl?: string;
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
  const [mobileUrlInput, setMobileUrlInput] = useState("");
  const [targetUrlInput, setTargetUrlInput] = useState("/products");
  const [intervalMs, setIntervalMs] = useState<number>(4000);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);

  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides);
    } else if (initialImages && initialImages.length > 0) {
      setSlides(initialImages.map((img) => ({ imageUrl: img, mobileImageUrl: "", targetUrl: "/products" })));
    } else if (initialImageUrl) {
      setSlides([{ imageUrl: initialImageUrl, mobileImageUrl: "", targetUrl: "/products" }]);
    } else {
      setSlides([]);
    }
    if (initialInterval) {
      setIntervalMs(initialInterval);
    }
  }, [initialSlides, initialImages, initialImageUrl, initialInterval]);

  // Handle adding an image by URL with a target URL and mobile URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedImg = urlInput.trim();
    const trimmedMobile = mobileUrlInput.trim();
    const trimmedTarget = targetUrlInput.trim() || "/products";

    if (!trimmedImg) {
      showToast("Desktop Banner Image is required. Please upload or enter a Cloudinary URL.", "error");
      return;
    }
    if (!trimmedMobile) {
      showToast("Mobile Banner Image is required. Please upload or enter a Cloudinary URL.", "error");
      return;
    }

    setSlides((prev) => [
      ...prev,
      { imageUrl: trimmedImg, mobileImageUrl: trimmedMobile, targetUrl: trimmedTarget },
    ]);
    setUrlInput("");
    setMobileUrlInput("");
    setTargetUrlInput("/products");
    showToast("Dual banner slide (Desktop + Mobile) added to queue.");
  };

  // Helper to upload single file to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch(`${BACKEND_URL}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Data, folder: "sanskriti_hero" }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.url || null;
    }
    return null;
  };

  // Handle Desktop Banner file uploads
  const handleDesktopFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingDesktop(true);
    showToast("Uploading Desktop Banner image to Cloudinary...", "success");

    try {
      const file = files[0];
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        setUrlInput(uploadedUrl);
        showToast("Desktop image uploaded! You can now add an optional mobile image and click Add.");
      } else {
        showToast("Cloudinary upload failed", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Cloudinary upload failed", "error");
    } finally {
      setIsUploadingDesktop(false);
      e.target.value = "";
    }
  };

  // Handle Mobile Banner file uploads
  const handleMobileFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMobile(true);
    showToast("Uploading Mobile Banner image to Cloudinary...", "success");

    try {
      const file = files[0];
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        setMobileUrlInput(uploadedUrl);
        showToast("Mobile image uploaded!");
      } else {
        showToast("Cloudinary upload failed", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Cloudinary upload failed", "error");
    } finally {
      setIsUploadingMobile(false);
      e.target.value = "";
    }
  };

  // Update properties for a specific slide
  const updateSlideProp = (index: number, key: keyof HeroSlideItem, value: string) => {
    setSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  // Re-upload Desktop image for an existing slide
  const handleSlideDesktopUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    showToast(`Uploading Desktop banner for Slide #${index + 1} to Cloudinary...`, "success");
    try {
      const url = await uploadToCloudinary(files[0]);
      if (url) {
        updateSlideProp(index, "imageUrl", url);
        showToast(`Slide #${index + 1} Desktop image updated successfully!`);
      } else {
        showToast("Cloudinary upload failed", "error");
      }
    } catch {
      showToast("Cloudinary upload failed", "error");
    } finally {
      e.target.value = "";
    }
  };

  // Re-upload Mobile image for an existing slide
  const handleSlideMobileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    showToast(`Uploading Mobile banner for Slide #${index + 1} to Cloudinary...`, "success");
    try {
      const url = await uploadToCloudinary(files[0]);
      if (url) {
        updateSlideProp(index, "mobileImageUrl", url);
        showToast(`Slide #${index + 1} Mobile image updated successfully!`);
      } else {
        showToast("Cloudinary upload failed", "error");
      }
    } catch {
      showToast("Cloudinary upload failed", "error");
    } finally {
      e.target.value = "";
    }
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

    // Enforce both Desktop & Mobile images for every slide
    const invalidSlideIndex = slides.findIndex(
      (s) => !s.imageUrl.trim() || !s.mobileImageUrl?.trim()
    );
    if (invalidSlideIndex !== -1) {
      showToast(
        `Slide #${invalidSlideIndex + 1} is missing a Desktop or Mobile image. Both are mandatory!`,
        "error"
      );
      return;
    }

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
        showToast("Hero banners (Desktop & Mobile) saved to Cloudinary & MongoDB successfully!");
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
          Hero Banner Carousel (Desktop & Mobile Dual Image Support)
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Each slide requires 2 images: one optimized for Desktop/Laptops, and another for Mobile screens.
        </p>
      </div>

      {/* Main Admin Form */}
      <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-8">
        
        {/* Upload & Add Controls */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            1. Add New Dual-Banner Slide (Desktop + Mobile)
          </label>

          <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Desktop Image Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">desktop_windows</span>
                  1. Desktop Banner Image (Required)
                </label>
                <input
                  type="url"
                  placeholder="https://... (Desktop Banner Cloudinary URL)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDesktopFileUpload}
                    disabled={isUploadingDesktop}
                    className="hidden"
                    id="desktop-file-input"
                  />
                  <label
                    htmlFor="desktop-file-input"
                    className="px-3 py-1.5 bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-500/30 text-[11px] rounded-md font-medium cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">cloud_upload</span>
                    {isUploadingDesktop ? "Uploading to Cloudinary..." : "Upload Desktop Image to Cloudinary"}
                  </label>
                </div>
              </div>

              {/* Mobile Image Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-teal-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">smartphone</span>
                  2. Mobile Banner Image (Mandatory)
                </label>
                <input
                  type="url"
                  placeholder="https://... (Mobile Banner Cloudinary URL)"
                  value={mobileUrlInput}
                  onChange={(e) => setMobileUrlInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-teal-500"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMobileFileUpload}
                    disabled={isUploadingMobile}
                    className="hidden"
                    id="mobile-file-input"
                  />
                  <label
                    htmlFor="mobile-file-input"
                    className="px-3 py-1.5 bg-teal-900/40 hover:bg-teal-800/60 text-teal-200 border border-teal-500/30 text-[11px] rounded-md font-medium cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">cloud_upload</span>
                    {isUploadingMobile ? "Uploading to Cloudinary..." : "Upload Mobile Image to Cloudinary"}
                  </label>
                </div>
              </div>
            </div>

            {/* Target Click URL */}
            <div className="pt-2 border-t border-neutral-900 space-y-2">
              <label className="text-xs font-semibold text-neutral-300 block">
                3. Click Target Navigation URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="/products or /products?category=kanjivaram"
                  value={targetUrlInput}
                  onChange={(e) => setTargetUrlInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs rounded-lg font-bold transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Banner Slide
                </button>
              </div>
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
              3. Current Hero Slides ({slides.length}) & Desktop/Mobile Image Config
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
              No slides in queue. Upload or add image URLs above to create banner slides.
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4 group relative"
                >
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                    <span className="bg-amber-500 text-neutral-950 font-bold text-xs px-2.5 py-0.5 rounded">
                      Slide #{index + 1}
                    </span>
                    
                    {/* Move & Delete Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSlide(index, "up")}
                        className="w-7 h-7 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border border-neutral-800"
                        title="Move Up"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        disabled={index === slides.length - 1}
                        onClick={() => moveSlide(index, "down")}
                        className="w-7 h-7 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border border-neutral-800"
                        title="Move Down"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSlide(index)}
                        className="w-7 h-7 rounded bg-rose-950/50 hover:bg-rose-900 text-rose-300 flex items-center justify-center border border-rose-900/40"
                        title="Remove Slide"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Desktop Image Section */}
                    <div className="space-y-2 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase text-amber-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">desktop_windows</span>
                          Desktop Banner (Mandatory):
                        </span>
                        {slide.imageUrl && (
                          <div className="w-14 h-9 rounded overflow-hidden bg-neutral-950 border border-neutral-800">
                            <img src={slide.imageUrl} alt="Desktop Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={slide.imageUrl}
                        onChange={(e) => updateSlideProp(index, "imageUrl", e.target.value)}
                        placeholder="Desktop Image Cloudinary URL"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlideDesktopUpload(index, e)}
                          className="hidden"
                          id={`slide-desktop-file-${index}`}
                        />
                        <label
                          htmlFor={`slide-desktop-file-${index}`}
                          className="px-2.5 py-1 bg-amber-950/50 hover:bg-amber-900 text-amber-300 border border-amber-500/30 text-[10px] rounded font-medium cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">upload_file</span>
                          Replace Desktop Banner
                        </label>
                      </div>
                    </div>

                    {/* Mobile Image Section */}
                    <div className="space-y-2 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase text-teal-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">smartphone</span>
                          Mobile Banner (Mandatory):
                        </span>
                        {slide.mobileImageUrl && (
                          <div className="w-10 h-10 rounded overflow-hidden bg-neutral-950 border border-neutral-800">
                            <img src={slide.mobileImageUrl} alt="Mobile Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={slide.mobileImageUrl || ""}
                        onChange={(e) => updateSlideProp(index, "mobileImageUrl", e.target.value)}
                        placeholder="Mobile Image Cloudinary URL"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-teal-500"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlideMobileUpload(index, e)}
                          className="hidden"
                          id={`slide-mobile-file-${index}`}
                        />
                        <label
                          htmlFor={`slide-mobile-file-${index}`}
                          className="px-2.5 py-1 bg-teal-950/50 hover:bg-teal-900 text-teal-300 border border-teal-500/30 text-[10px] rounded font-medium cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">upload_file</span>
                          Replace Mobile Banner
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Target URL */}
                  <div className="pt-2 border-t border-neutral-900">
                    <label className="text-[10px] font-semibold uppercase text-neutral-400 block mb-1">
                      Click Navigation Target URL:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={slide.targetUrl || "/products"}
                        onChange={(e) => updateSlideProp(index, "targetUrl", e.target.value)}
                        placeholder="/products"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
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
          {isSaving ? "Saving Carousel Configuration to MongoDB..." : "Save Hero Carousel Configuration"}
        </button>
      </form>
    </div>
  );
}
