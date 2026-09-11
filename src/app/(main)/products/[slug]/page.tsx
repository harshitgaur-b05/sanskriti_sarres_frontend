"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { mockProducts } from "@/lib/mockData";
import { useCart } from "@/lib/CartContext";

interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  image?: string;
  images?: string[];
  category: string;
  isBestSeller?: boolean;
  colors?: string[];
  tags?: string[];
  sku?: string;
  fabric?: string;
  blousePiece?: string;
  occasion?: string;
  washCare?: string;
  weight?: string;
  length?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function getId(p: Product) { return p._id || p.id; }
function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

// Expand a single image into a pseudo-gallery by using different crop params
function buildGallery(image?: string): string[] {
  if (!image) return [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800&sat=-20",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
  ];
  return [image, image, image];
}

// Accordion item for product details
function Accordion({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-outline-variant/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-label-md text-[11px] uppercase tracking-[0.2em] text-on-surface group-hover:text-primary transition-colors">
          {title}
        </span>
        <span
          className="material-symbols-outlined text-on-surface-variant text-sm transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="pb-5 font-body-md text-sm text-on-surface-variant leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const [expandedTab, setExpandedTab] = useState<"details" | "care" | "shipping">("details");
  const { addToCart } = useCart();

  useEffect(() => {
    // Try fetching from backend
    fetch(`${BACKEND_URL}/api/products`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) => {
        if (data?.length > 0) {
          setAllProducts(data);
          const found = data.find(
            (p) => p.slug === slug || p._id === slug || p.id === slug
          );
          setProduct(found || null);
        } else {
          // Fallback to mock
          const found = (mockProducts as unknown as Product[]).find(
            (p) => p.slug === slug || p.id === slug
          );
          setProduct(found || (mockProducts[0] as unknown as Product));
          setAllProducts(mockProducts as unknown as Product[]);
        }
      })
      .catch(() => {
        const found = (mockProducts as unknown as Product[]).find(
          (p) => p.slug === slug || p.id === slug
        );
        setProduct(found || (mockProducts[0] as unknown as Product));
        setAllProducts(mockProducts as unknown as Product[]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToBag = () => {
    if (!product) return;
    const pid = getId(product);
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: pid,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        category: product.category,
      });
    }
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-[3/4] bg-surface-container-high rounded" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-surface-container-high rounded w-1/3" />
            <div className="h-8 bg-surface-container-high rounded w-3/4" />
            <div className="h-6 bg-surface-container-high rounded w-1/4" />
            <div className="h-24 bg-surface-container-high rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant block mb-4">sentiment_dissatisfied</span>
        <h1 className="font-headline-md text-2xl text-on-surface mb-2">Product not found</h1>
        <Link href="/products" className="text-primary text-sm underline">Back to all sarees</Link>
      </div>
    );
  }

  const gallery = product.images?.length ? product.images : buildGallery(product.image);
  const pid = getId(product);

  // Similar products: same category, different id
  const similar = allProducts
    .filter((p) => p.category === product.category && getId(p) !== pid)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-surface min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-outline-variant/20 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3 flex items-center gap-2 text-[10px] font-label-md uppercase tracking-wider">
          <Link href="/" className="text-on-surface-variant hover:text-on-surface transition-colors">Home</Link>
          <span className="text-outline-variant">|</span>
          <Link href="/products" className="text-on-surface-variant hover:text-on-surface transition-colors">Sarees</Link>
          <span className="text-outline-variant">|</span>
          <Link href="/products" className="text-on-surface-variant hover:text-on-surface transition-colors">{product.category}</Link>
          <span className="text-outline-variant">|</span>
          <span className="text-on-surface line-clamp-1 max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main product section */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ── Left: Image Gallery ── */}
          <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
            {/* Thumbnails (vertical on md+) */}
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 md:w-20 aspect-[3/4] overflow-hidden border-2 transition-all ${
                    activeImg === i
                      ? "border-primary"
                      : "border-outline-variant/30 hover:border-outline-variant"
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative overflow-hidden bg-surface-container group">
              <div className="aspect-[3/4]">
                <img
                  src={gallery[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Nav arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((prev) => (prev - 1 + gallery.length) % gallery.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-surface-container-lowest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-lowest"
                  >
                    <span className="material-symbols-outlined text-sm text-on-surface">chevron_left</span>
                  </button>
                  <button
                    onClick={() => setActiveImg((prev) => (prev + 1) % gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-surface-container-lowest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-lowest"
                  >
                    <span className="material-symbols-outlined text-sm text-on-surface">chevron_right</span>
                  </button>
                </>
              )}
              {/* Best seller badge */}
              {product.isBestSeller && (
                <div className="absolute top-4 left-4 bg-[#8B1A1A] text-white px-3 py-1 text-[9px] font-label-md uppercase tracking-wider">
                  Best Seller
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="lg:sticky lg:top-6 flex flex-col">
            {/* Actions row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-2">
                  {product.category}
                </span>
                <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface leading-tight">
                  {product.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button className="w-9 h-9 border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors" title="Share">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>share</span>
                </button>
                <button className="w-9 h-9 border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors" title="Wishlist">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>favorite_border</span>
                </button>
              </div>
            </div>

            {/* Breadcrumb category + SKU */}
            <div className="flex items-center gap-2 mb-4 text-[10px] font-label-md uppercase tracking-wider text-on-surface-variant">
              {product.sku && <span>Product SKU: {product.sku}</span>}
            </div>

            {/* Description */}
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-6 border-b border-outline-variant/20 pb-6">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-headline-md text-2xl md:text-3xl text-on-surface font-semibold">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-on-surface-variant line-through font-body-md text-base">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-[11px] font-label-md text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="font-label-md text-[10px] text-on-surface-variant mt-1 uppercase tracking-wider">
                Inclusive of all taxes (For Customers in India)
              </p>
            </div>

            {/* Stock indicator */}
            {product.stock !== undefined && product.stock <= 3 && product.stock > 0 && (
              <p className="font-label-md text-[11px] text-[#C62828] mb-4">
                Only {product.stock} {product.stock === 1 ? "piece" : "pieces"} available in stock.
              </p>
            )}
            {product.stock === 0 && (
              <p className="font-label-md text-[11px] text-on-surface-variant mb-4 uppercase tracking-wider">
                Out of Stock
              </p>
            )}

            {/* Quantity */}
            <div className="mb-5">
              <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-on-surface block mb-2">
                Quantity:
              </span>
              <div className="inline-flex items-center border border-outline-variant">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="w-12 text-center font-body-md text-sm text-on-surface select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  disabled={product.stock !== undefined && qty >= product.stock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Add to Bag */}
            <button
              onClick={handleAddToBag}
              disabled={product.stock === 0}
              className={`w-full py-4 flex items-center justify-center gap-2.5 font-label-md text-xs uppercase tracking-[0.2em] transition-all duration-200 mb-3 ${
                addedMsg
                  ? "bg-emerald-700 text-white"
                  : product.stock === 0
                  ? "bg-surface-container text-on-surface-variant cursor-not-allowed"
                  : "bg-[#8B1A1A] text-white hover:bg-[#6B1414] active:scale-[0.99]"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {addedMsg ? "check_circle" : "shopping_bag"}
              </span>
              {addedMsg ? "Added to Bag!" : product.stock === 0 ? "Out of Stock" : "Add to Bag"}
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 my-5 border-t border-b border-outline-variant/20 py-5">
              {[
                { icon: "verified", text: "Silk Mark Certified" },
                { icon: "local_shipping", text: "Free Shipping" },
                { icon: "swap_horiz", text: "Easy Returns" },
              ].map((b) => (
                <div key={b.text} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "20px" }}>{b.icon}</span>
                  <span className="font-label-md text-[9px] uppercase tracking-wider text-on-surface-variant leading-tight">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div>
              <Accordion title="Product Details" defaultOpen>
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-outline-variant/20">
                    {[
                      ["Category", product.category],
                      ["Fabric", product.fabric || "Pure Silk"],
                      ["Blouse Piece", product.blousePiece || "Unstitched blouse included"],
                      ["Occasion", product.occasion || "Festive / Bridal / Formal"],
                      ["Saree Length", product.length || "6.5 meters"],
                      ["Weight", product.weight || "800–900 grams"],
                      ["SKU", product.sku || getId(product)],
                    ].map(([key, val]) => val ? (
                      <tr key={key}>
                        <td className="py-2 pr-4 text-on-surface-variant font-label-md uppercase tracking-wider w-1/3">{key}</td>
                        <td className="py-2 text-on-surface">{val}</td>
                      </tr>
                    ) : null)}
                  </tbody>
                </table>
              </Accordion>

              <Accordion title="Wash & Care">
                <ul className="space-y-2 list-none">
                  {[
                    "Dry clean only recommended for first wash",
                    "Hand wash with mild detergent in cold water",
                    "Do not wring or tumble dry",
                    "Store in a cotton muslin cloth away from direct sunlight",
                    "Iron on reverse side with medium heat",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0" style={{ fontSize: "14px", marginTop: "2px" }}>chevron_right</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>

              <Accordion title="Shipping & Returns">
                <ul className="space-y-2 list-none">
                  {[
                    "Free shipping across India on all orders",
                    "International shipping available — rates at checkout",
                    "Dispatched within 2–4 business days",
                    "Easy 7-day returns on unworn, unaltered pieces",
                    "Contact us for bespoke customisation requests",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0" style={{ fontSize: "14px", marginTop: "2px" }}>chevron_right</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ── Similar Colors / Related Products ── */}
      {similar.length > 0 && (
        <section className="border-t border-outline-variant/20 bg-surface-container-low py-12 md:py-16">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-8">
              <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">Similar Sarees</h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">From the {product.category} collection</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {similar.map((p) => {
                const spid = getId(p);
                const sslug = p.slug || spid;
                return (
                  <Link key={spid} href={`/products/${sslug}`} className="group flex flex-col">
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-container mb-3">
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600"}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Hover add to bag */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({ id: spid, name: p.name, price: Number(p.price), image: p.image, category: p.category });
                          }}
                          className="w-full py-2.5 bg-[#8B1A1A] text-white text-[10px] font-label-md uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 hover:bg-[#6B1414] transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>shopping_bag</span>
                          Add to Bag
                        </button>
                      </div>
                      <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "14px" }}>favorite_border</span>
                      </button>
                    </div>
                    <span className="font-label-md text-[9px] uppercase tracking-wider text-on-surface-variant">{p.category}</span>
                    <span className="font-headline-md text-sm text-on-surface mt-0.5 line-clamp-1 group-hover:text-primary transition-colors">{p.name}</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-body-md text-sm font-semibold text-on-surface">{formatINR(p.price)}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-on-surface-variant line-through">{formatINR(p.originalPrice)}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Back to collection CTA ── */}
      <section className="py-10 bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-label-md text-xs uppercase tracking-widest text-on-surface hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to All Sarees
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-label-md text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
          >
            View Full Collection
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
