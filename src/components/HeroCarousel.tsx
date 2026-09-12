"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";

const FALLBACK_SLIDES = [
  "/screen.png",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=1600"
];

interface HeroCarouselProps {
  images?: string[];
  interval?: number;
}

export default function HeroCarousel({
  images = [],
  interval = 4000,
}: HeroCarouselProps) {
  const slideImages = images.length > 0 ? images : FALLBACK_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slideImages.length);
  }, [slideImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  }, [slideImages.length]);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || slideImages.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [isPaused, interval, slideImages.length, nextSlide]);

  // Reset index if image list changes and index exceeds length
  useEffect(() => {
    if (currentIndex >= slideImages.length) {
      setCurrentIndex(0);
    }
  }, [slideImages.length, currentIndex]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      nextSlide(); // Swiped left
    } else if (diff < -50) {
      prevSlide(); // Swiped right
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-surface-container-highest select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative min-h-[85vh] lg:min-h-[720px] flex flex-col justify-end lg:justify-center items-center lg:items-start">
        {/* Background Slides */}
        <div className="absolute inset-0 w-full h-full">
          {slideImages.map((imgUrl, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={idx}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
                } transition-transform duration-1000`}
              >
                <img
                  alt={`Sanskriti Saree Banner ${idx + 1}`}
                  src={imgUrl}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            );
          })}

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t lg:bg-gradient-to-r from-surface-container-lowest/95 via-surface-container/75 to-transparent lg:w-3/5" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-30 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pt-28 lg:pt-36 pb-16 lg:pb-24 text-center lg:text-left">
          <div className="max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-lowest/95 backdrop-blur-sm rounded-full mb-6 shadow-sm border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-md text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-on-surface">
                Exclusive Handloom Collection
              </span>
            </div>

            <h1 className="font-headline-lg lg:font-display-md text-headline-lg-mobile md:text-headline-lg lg:text-display-md text-on-surface mb-6 leading-none tracking-tight">
              Threads of <br className="hidden lg:block" />
              <span className="font-display-md font-light lg:ml-2 text-primary">India</span>
            </h1>

            <p className="font-body-md md:font-body-lg text-sm md:text-body-lg text-on-surface-variant mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Where archival heritage meets the modern drape. A curation of timeless silhouettes woven for generations.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 mb-4 lg:mb-12">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary font-label-md text-xs uppercase tracking-[0.15em] hover:bg-tertiary-container transition-all duration-300 shadow-md hover:shadow-xl w-full sm:w-auto rounded-xs"
              >
                Explore Archives
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant text-on-surface font-label-md text-xs uppercase tracking-[0.15em] hover:bg-surface-container transition-all duration-300 shadow-sm w-full sm:w-auto rounded-xs"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Controls: Arrows & Indicators */}
        {slideImages.length > 1 && (
          <>
            {/* Left/Right Arrow Navigation */}
            <div className="absolute inset-y-0 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-lowest/70 backdrop-blur-md hover:bg-surface-container-lowest text-on-surface hover:text-primary flex items-center justify-center transition-all shadow-lg border border-outline-variant/30 hover:scale-105"
              >
                <span className="material-symbols-outlined text-xl md:text-2xl">chevron_left</span>
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-lowest/70 backdrop-blur-md hover:bg-surface-container-lowest text-on-surface hover:text-primary flex items-center justify-center transition-all shadow-lg border border-outline-variant/30 hover:scale-105"
              >
                <span className="material-symbols-outlined text-xl md:text-2xl">chevron_right</span>
              </button>
            </div>

            {/* Bottom Indicators & Slide Counter */}
            <div className="absolute bottom-6 left-0 right-0 z-40 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/80 backdrop-blur-md rounded-full shadow-md border border-outline-variant/30">
                {slideImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      idx === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-on-surface-variant/40 hover:bg-on-surface-variant/80"
                    }`}
                  />
                ))}
              </div>

              {/* Counter Badge */}
              <span className="text-[10px] uppercase font-mono tracking-widest text-on-surface-variant/90 bg-surface-container-lowest/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                0{currentIndex + 1} / 0{slideImages.length} {isPaused && "• Paused"}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
