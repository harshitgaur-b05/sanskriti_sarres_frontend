"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { optimizeImage } from "@/lib/image";

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left font-semibold text-sm text-on-surface"
      >
        {title}
        <span className="material-symbols-outlined text-on-surface-variant text-xl transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          expand_more
        </span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

interface Product {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock?: number;
  image?: string;
  category: string;
  isBestSeller?: boolean;
  colors?: string[];
  similarPieces?: string[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setCartOpen } = useCart();

  useEffect(() => {
    if (!productId) return;

    fetch(`${BACKEND_URL}/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch product error:", err);
        setError("Saree details could not be loaded or piece is unavailable.");
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    const pid = product._id || product.id || productId;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: pid,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        category: product.category,
      });
    }
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-caption text-xs uppercase tracking-widest text-on-surface-variant">Loading Weave Archive...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
        <div className="space-y-4 max-w-md">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">find_in_page</span>
          <h1 className="font-headline-md text-2xl text-on-surface">Piece Unavailable</h1>
          <p className="text-xs text-on-surface-variant">{error || "The requested saree drape could not be located in our active vault."}</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-primary text-on-primary text-xs uppercase tracking-widest font-label-md">
            Explore Full Saree Collection
          </Link>
        </div>
      </div>
    );
  }

  const stock = typeof product.stock === "number" ? product.stock : 10;
  const isOutOfStock = stock <= 0;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16">
      <div className="mb-6 flex items-center gap-2 text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Product Image Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30 shadow-lg flex items-center justify-center min-h-[50vh]">
            <img
              src={optimizeImage(product.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200", 1200)}
              alt={product.name}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
          {/* Badges below image — never overlap on mobile */}
          <div className="flex flex-wrap gap-2 pt-1">
            {product.isBestSeller && (
              <span className="bg-[#8B1A1A] text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5">
                Archival Bestseller
              </span>
            )}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 ${
              isOutOfStock ? "bg-on-surface text-surface" : "bg-primary text-on-primary"
            }`}>
              {isOutOfStock ? "Sold Out" : `In Vault (${stock} Available)`}
            </span>
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="lg:col-span-5 space-y-6 lg:pl-4">
          <div>
            <span className="font-caption text-xs uppercase tracking-[0.25em] text-primary block mb-2 font-semibold">
              {product.category} Handloom Edit
            </span>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface leading-tight mb-3">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <span className="font-headline-md text-xl md:text-2xl font-bold text-on-surface">
                MRP ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{Math.round(Number(product.price) * 1.15 / 100 * 100).toLocaleString("en-IN")}
              </span>
              <span className="text-sm font-bold text-[#8B1A1A]">15% OFF</span>
            </div>
            <p className="text-xs text-on-surface-variant">(Inclusive of all taxes) · <span className="text-rose-700 font-semibold">{stock <= 3 ? `Only ${stock} left!` : `${stock} in stock`}</span></p>

            {/* Colors Display */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block mb-2">Available Colors</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => {
                    const isHex = color.startsWith("#");
                    // Minimal preset map just for the product page display
                    const presetLabels: Record<string, string> = {
                      "#9B1B30": "Ruby Red", "#5C1A1A": "Deep Maroon", "#1B3A6B": "Royal Blue", "#006B5E": "Peacock Green",
                      "#C8960C": "Gold", "#F5F0E8": "Ivory", "#C89A2A": "Mustard", "#D4687A": "Rose Pink",
                      "#6B3FA0": "Violet", "#C4562A": "Brick Orange", "#0F7E7E": "Teal", "#1A237E": "Navy",
                      "#D4C5A9": "Beige", "#1A1A1A": "Black", "#F8F8F8": "White"
                    };
                    return (
                      <div key={color} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-low shadow-sm">
                        {isHex && (
                          <span 
                            className="w-3 h-3 rounded-full border border-outline-variant/50 flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        )}
                        <span className="text-xs text-on-surface font-medium">
                          {isHex ? (presetLabels[color] || "Color") : color}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-outline-variant/30 py-4 space-y-2 font-body-md text-xs text-on-surface-variant leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="font-label-md text-xs uppercase tracking-wider text-on-surface">Quantity:</span>
                <div className="flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface-container-low">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-on-surface hover:bg-surface-container font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-semibold text-on-surface min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="px-3 py-1.5 text-on-surface hover:bg-surface-container font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-4 bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest rounded-xs hover:bg-tertiary-container active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Shopping Bag"}
              </button>
              <Link
                href="/checkout"
                className="py-4 px-6 border border-outline text-on-surface text-center font-label-md text-xs uppercase tracking-widest rounded-xs hover:bg-surface-container active:scale-[0.98] transition-all font-semibold"
              >
                Go to Checkout
              </Link>
            </div>

            {/* Unstitched Disclaimer */}
            <div className="bg-surface-container border border-outline-variant/40 rounded-lg p-3 flex gap-2 items-start mt-4">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">info</span>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-wider">Note: Saree comes unstitched. We do not provide stitching, fall, or picot services.</p>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="mt-4 border-t border-outline-variant/20 divide-y divide-outline-variant/20">
            <AccordionItem title="Delivery & Returns">
              <ul className="list-disc list-inside text-xs text-on-surface-variant space-y-1.5 leading-relaxed">
                <li>Returns accepted within 7 days from receipt of product(s)</li>
                <li>Refunds processed within 7–15 business days after product(s) reach our warehouse</li>
                <li>For more details, refer to our <Link href="/refund-policy" className="text-primary underline">Return &amp; Cancellation Policy</Link></li>
                <li>Products with 50% or more discount are not eligible for return</li>
              </ul>
            </AccordionItem>
            <AccordionItem title="Contact Details">
              <div className="text-xs text-on-surface-variant space-y-2">
                <p>Feel free to contact our Customer Care team:</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">call</span>
                  <span>+91 98765 43210 (Mon–Sat, 10am to 6pm)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">mail</span>
                  <span>support@sanskritimill.com</span>
                </div>
              </div>
            </AccordionItem>
            <AccordionItem title="More">
              <div className="text-xs text-on-surface-variant space-y-1 leading-relaxed">
                <div><strong>Country of Origin:</strong> India</div>
                <div><strong>Craft:</strong> Traditional Varanasi / Handloom Weave</div>
                <div><strong>Blouse Piece:</strong> Included (Unstitched)</div>
                <div><strong>Guarantee:</strong> Silk Mark Verified</div>
                <div className="pt-1"><strong>Manufactured & Marketed By:</strong><br />Sanskriti Sarees Mill, Varanasi, Uttar Pradesh – 221001</div>
              </div>
            </AccordionItem>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Add to Cart (Mobile Only) */}
      {!isOutOfStock && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/30 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between gap-4 pb-safe">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-on-surface-variant tracking-wider font-semibold">Price</span>
            <span className="text-sm font-bold text-on-surface">₹{Number(product.price).toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-primary text-on-primary font-label-md text-[11px] uppercase tracking-widest rounded-sm active:scale-[0.98] transition-transform font-bold"
          >
            Add to Bag
          </button>
        </div>
      )}
    </div>
  );
}
