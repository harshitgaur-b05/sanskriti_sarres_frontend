"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { optimizeImage } from "@/lib/image";

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
      className="relative w-full overflow-hidden bg-black select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/*
        Mobile  : aspect-[3/4] — portrait, shows full tall saree images without cutting
        Tablet  : aspect-[4/3]
        Desktop : fixed 90vh — cinematic full-screen feel
      */}
      {/* 
        Mobile: auto height so image shows at its natural ratio — nothing ever cropped.
        Desktop: fixed 92vh cinematic view with object-cover.
      */}
      <div className="relative w-full md:h-[92vh] md:min-h-[600px]">

        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          const targetUrl = slide.targetUrl || "/products";
          const isExternal = targetUrl.startsWith("http://") || targetUrl.startsWith("https://");

          return (
            <div
              key={idx}
              className={`
                md:absolute md:inset-0 w-full h-full
                transition-opacity duration-1000 ease-in-out
                ${isActive ? "opacity-100 z-10 block" : "opacity-0 z-0 hidden md:block md:pointer-events-none"}
              `}
            >
              <Link
                href={targetUrl}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="block w-full h-full"
              >
                <picture className="block w-full h-full">
                  {slide.mobileImageUrl && (
                    <source media="(max-width: 767px)" srcSet={optimizeImage(slide.mobileImageUrl, 900)} />
                  )}
                  <img
                    alt={`Sanskriti Sarees Banner ${idx + 1}`}
                    src={optimizeImage(slide.imageUrl, 1600)}
                    {...(idx === 0 ? { fetchPriority: "high" } : { loading: "lazy" })}
                    decoding="async"
                    className="w-full h-auto md:h-full md:object-cover md:object-top"
                  />
                </picture>
              </Link>
            </div>
          );
        })}

        {/* Dots */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
