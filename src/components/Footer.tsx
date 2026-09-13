import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low py-10 md:py-12 px-margin-mobile md:px-margin-desktop border-t border-outline-variant/30 mt-auto">
      <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="Sanskriti Sarees Mill Logo" className="h-10 w-auto object-contain" />
            <h3 className="font-headline-md text-xl text-on-surface uppercase tracking-widest font-bold">Sanskriti</h3>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant max-w-xs mt-2">
            Varanasi's premier handloom weaving mill. Archival heritage preserved through pure silk drapes.
          </p>
          <div className="mt-3 text-xs text-on-surface-variant space-y-1">
            <p><strong>Support:</strong> support@sanskritisarees.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Address:</strong> Varanasi Weaving House, UP, India</p>
          </div>
        </div>
        <div>
          <h4 className="font-label-md text-[10px] md:text-xs uppercase tracking-widest text-on-surface mb-3 md:mb-4">Shop</h4>
          <ul className="space-y-2 font-body-md text-xs md:text-sm text-on-surface-variant">
            <li><Link href="/products" className="hover:text-primary transition-colors">All Sarees</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Bestsellers</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Bridal Collection</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-md text-[10px] md:text-xs uppercase tracking-widest text-on-surface mb-3 md:mb-4">Policies & Support</h4>
          <ul className="space-y-2 font-body-md text-xs md:text-sm text-on-surface-variant">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping & Delivery</Link></li>
            <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-label-md text-[10px] md:text-xs uppercase tracking-widest text-on-surface mb-3 md:mb-4">Newsletter</h4>
          <p className="font-body-md text-xs md:text-sm text-on-surface-variant mb-4">
            Subscribe for exclusive archival releases.
          </p>
          <div className="flex items-center border-b border-outline-variant pb-2">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="bg-transparent w-full font-label-md text-[10px] md:text-xs uppercase placeholder:text-on-surface-variant/50 focus:outline-none text-on-surface"
            />
            <button className="material-symbols-outlined text-on-surface hover:text-primary transition-colors text-base">arrow_forward</button>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto mt-8 md:mt-12 pt-6 md:pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-caption text-[10px] md:text-xs text-on-surface-variant tracking-wider text-center md:text-left">
          &copy; {new Date().getFullYear()} Sanskriti Sarees Mill. All Rights Reserved.
        </p>
        <div className="flex gap-4 font-caption text-[10px] md:text-xs text-on-surface-variant tracking-wider uppercase">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          <Link href="/refund-policy" className="hover:text-primary">Returns & Refunds</Link>
        </div>
      </div>
    </footer>
  );
}
