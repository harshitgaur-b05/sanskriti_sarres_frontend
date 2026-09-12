"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, setCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 shadow-md py-0"
          : "bg-gradient-to-b from-surface-container-lowest/90 via-surface-container-lowest/40 to-transparent border-b border-transparent py-1"
      }`}
    >
      <div className="h-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-12">
          <button
            className="lg:hidden text-on-surface"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-headline-md text-headline-md text-on-surface uppercase tracking-[0.25em] text-[17px] font-bold drop-shadow-xs">
              Sanskriti
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-gutter">
            <Link
              href="/"
              className="font-label-md text-label-md text-on-surface uppercase tracking-widest hover:text-primary transition-colors font-medium text-xs"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors font-medium text-xs"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors font-medium text-xs"
            >
              About Us
            </Link>
            <Link
              href="/blog"
              className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors font-medium text-xs"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors font-medium text-xs"
            >
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            aria-label="Search"
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          <button
            aria-label="Favorites"
            className="text-on-surface-variant hover:text-on-surface transition-colors hidden sm:block"
          >
            <span className="material-symbols-outlined">favorite</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label={`Open cart, ${totalItems} items`}
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-on-primary text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-xs">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Profile / Admin Icon */}
          <Link
            href="/admin"
            className="w-8 h-8 rounded-full bg-primary hover:bg-tertiary-container flex items-center justify-center sm:ml-2 cursor-pointer transition-all shadow-xs"
            title="Admin Portal"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 py-4 px-margin-mobile flex flex-col gap-4 shadow-xl">
          <Link
            href="/"
            className="font-label-md text-label-md text-on-surface uppercase tracking-widest hover:text-primary transition-colors py-2 border-b border-outline-variant/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2 border-b border-outline-variant/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/about"
            className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2 border-b border-outline-variant/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/blog"
            className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2 border-b border-outline-variant/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
