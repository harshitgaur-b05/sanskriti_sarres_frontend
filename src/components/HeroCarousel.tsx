"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";

export interface HeroSlide {
  imageUrl: string;
  mobileImageUrl?: string;
  targetUrl?: string;
}

interface HeroCarouselProps {
  slides?: HeroSlide[];
  images?: string[];
  interval?: number;
}

export default function HeroCarousel({
  slides = [],
  images = [],
  interval = 4000,
}: HeroCarouselProps) {
  // Only use what's provided — no hardcoded fallbacks
  const activeSlides: HeroSlide[] =
    slides.length > 0
      ? slides
      : images.length > 0
      ? images.map((img) => ({ imageUrl: img, targetUrl: "/products" }))
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Auto-scroll effect
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [interval, activeSlides.length, nextSlide]);

  // Reset index if slide list changes and index exceeds length
  useEffect(() => {
    if (currentIndex >= activeSlides.length) {
      setCurrentIndex(0);
    }
  }, [activeSlides.length, currentIndex]);

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
      className="relative w-full overflow-hidden bg-surface-container-highest select-none cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[60vh] sm:h-[75vh] md:h-[calc(100vh-80px)] min-h-[360px] md:min-h-[500px] w-full flex items-center justify-center">
        {/* Full Image Background Slides with Clickable Link */}
        <div className="absolute inset-0 w-full h-full">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const targetUrl = slide.targetUrl || "/products";
            const isExternal = targetUrl.startsWith("http://") || targetUrl.startsWith("https://");

            return (
              <div
                key={idx}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
                } transition-transform duration-1000`}
              >
                <Link
                  href={targetUrl}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="block w-full h-full cursor-pointer group"
                >
                  <picture className="block w-full h-full">
                    {slide.mobileImageUrl && (
                      <source media="(max-width: 767px)" srcSet={slide.mobileImageUrl} />
                    )}
                    <img
                      alt={`Sanskriti Saree Banner ${idx + 1}`}
                      src={slide.imageUrl}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
                    />
                  </picture>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
