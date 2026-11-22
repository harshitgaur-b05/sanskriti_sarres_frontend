import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low py-10 md:py-12 px-margin-mobile md:px-margin-desktop border-t border-outline-variant/30 mt-auto">
      <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo_sanskriti.webp" alt="Sanskriti Sarees Mill Logo" className="h-10 w-auto object-contain" />
            <h3 className="font-headline-md text-lg text-on-surface tracking-tight font-bold">Sanskriti Sarees Mill</h3>
          </div>
          <p className="font-body-md text-xs md:text-sm text-on-surface-variant max-w-xs mt-2 leading-relaxed">
            Local saree retail shop based in Shahdara, Delhi. Offering curated traditional, bridal, and festive sarees.
          </p>
          <div className="mt-3 text-xs text-on-surface-variant space-y-1">
            <p><strong>Official Email:</strong> <a href="mailto:sanskritisareeemail@gmail.com" className="hover:text-primary underline">sanskritisareeemail@gmail.com</a></p>
            <p><strong>Address:</strong> D 663, Main 100 Feet Rd, Chanderlok Colony, Durgapuri Extension, Chanderlok, Shahdara, Delhi, 110032, India</p>
          </div>
        </div>
        <div>
          <h4 className="font-label-md text-[10px] md:text-xs uppercase tracking-widest text-on-surface mb-3 md:mb-4">Shop & Explore</h4>
          <ul className="space-y-2 font-body-md text-xs md:text-sm text-on-surface-variant">
            <li><Link href="/products" className="hover:text-primary transition-colors">All Sarees</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Bridal Collection</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">The Weaver's Journal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-md text-[10px] md:text-xs uppercase tracking-widest text-on-surface mb-3 md:mb-4">Policies & Customer Support</h4>
          <ul className="space-y-2 font-body-md text-xs md:text-sm text-on-surface-variant">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping & Delivery Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Returns & Refunds Policy</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact & Support</Link></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-label-md text-[10px] md:text-xs uppercase tracking-widest text-on-surface mb-3 md:mb-4">Customer Care</h4>
          <p className="font-body-md text-xs md:text-sm text-on-surface-variant mb-3 leading-relaxed">
            Have questions about an order or saree drape? Reach out to our concierge team at:
          </p>
          <a
            href="mailto:sanskritisareeemail@gmail.com"
            className="inline-block text-xs font-semibold text-primary underline underline-offset-4 hover:opacity-80"
          >
            sanskritisareeemail@gmail.com
          </a>
          <p className="text-[11px] text-on-surface-variant/80 mt-3">
            In-store visits: Shahdara, Delhi - 110032
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto mt-8 md:mt-12 pt-6 md:pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-caption text-[10px] md:text-xs text-on-surface-variant tracking-wider text-center md:text-left">
          &copy; {new Date().getFullYear()} Sanskriti Sarees Mill. All Rights Reserved. Shahdara, Delhi, India.
        </p>
        <div className="flex flex-wrap gap-4 font-caption text-[10px] md:text-xs text-on-surface-variant tracking-wider uppercase">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          <Link href="/shipping-policy" className="hover:text-primary">Shipping Policy</Link>
          <Link href="/refund-policy" className="hover:text-primary">Returns & Refunds</Link>
          <Link href="/contact" className="hover:text-primary">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
