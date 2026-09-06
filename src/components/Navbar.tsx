"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30">
        <div className="h-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-12">
            <button 
              className="lg:hidden text-on-surface"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-headline-md text-headline-md text-on-surface uppercase tracking-widest text-[16px]">Sankriti</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-gutter">
              <Link href="/" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors">Home</Link>
              <Link href="/products" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors">Products</Link>
              <Link href="/about" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors">About Us</Link>
              <Link href="/blog" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors">Blog</Link>
              <Link href="/contact" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors">Contact Us</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors hidden sm:block">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center sm:ml-2 cursor-pointer">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-surface-container-lowest border-b border-outline-variant/30 py-4 px-margin-mobile flex flex-col gap-4 shadow-lg">
            <Link href="/" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2 border-b border-outline-variant/20">Home</Link>
            <Link href="/products" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2 border-b border-outline-variant/20">Products</Link>
            <Link href="/about" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2 border-b border-outline-variant/20">About Us</Link>
            <Link href="/blog" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2 border-b border-outline-variant/20">Blog</Link>
            <Link href="/contact" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2">Contact Us</Link>
          </div>
        )}
      </header>
      
      {/* Top Announcement Bar */}
      <aside className="bg-primary text-on-primary py-2.5 px-margin-mobile md:px-margin-desktop text-[10px] md:text-caption tracking-[0.18em] uppercase transition-all duration-300">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3 text-center md:text-left">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-surface-bright animate-pulse flex-shrink-0"></span>
            <span className="tracking-widest">Complimentary Fall & Pico Stitching on All Silk Orders</span>
          </div>
          <div className="flex items-center gap-6 text-[9px] md:text-[10px] tracking-widest">
            <a className="opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1" href="#assistance">
              <span className="material-symbols-outlined text-[13px]">support_agent</span>
              <span>Concierge</span>
            </a>
            <a className="opacity-80 hover:opacity-100 transition-opacity" href="#track-order">Track Order</a>
          </div>
        </div>
      </aside>
    </>
  );
}
