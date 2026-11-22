import Link from "next/link";

export const metadata = {
  title: "About Us | Sanskriti Sarees Mill",
  description: "Learn about Sanskriti Sarees Mill, a local saree retail shop based in Shahdara, Delhi offering curated traditional and bridal drapes.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="font-label-md text-[10px] md:text-xs uppercase tracking-[0.25em] text-on-surface-variant block mb-3">
          Our Story
        </span>
        <h1 className="font-headline-lg lg:font-display-md text-3xl md:text-4xl text-on-surface mb-6">
          Sanskriti Sarees Mill
        </h1>
        <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
          A local saree retail shop located at Shahdara, Delhi, dedicated to bringing you carefully selected traditional drapes, bridal collections, and festive ethnic wear.
        </p>
      </div>

      <div className="space-y-8 font-body-md text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-6 md:p-10 rounded-2xl border border-outline-variant/30">
        <div>
          <h2 className="font-headline-md text-xl text-on-surface mb-3">Local Heritage in Delhi</h2>
          <p>
            Operating from D 663, Main 100 Feet Rd, Chanderlok Colony, Shahdara, Delhi, Sanskriti Sarees Mill serves saree lovers seeking timeless elegance and authentic drapes. We curate a diverse variety of sarees — ranging from classic silks and festive brocades to lightweight daily wear and ornate wedding attire.
          </p>
        </div>

        <div>
          <h2 className="font-headline-md text-xl text-on-surface mb-3">What We Offer</h2>
          <p>
            Every saree in our collection is carefully inspected for fabric quality, weave finish, and design appeal before reaching our customers. We offer unstitched sarees with matching or contrasting blouse pieces, allowing you to tailor your drape to your individual style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-xs">
            <span className="material-symbols-outlined text-3xl text-primary mb-3 block">storefront</span>
            <h3 className="font-title-lg text-base text-on-surface mb-1">Local Retail Shop</h3>
            <p className="text-xs text-on-surface-variant">Located on 100 Feet Road, Shahdara, Delhi, serving local and online customers with dedication.</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-xs">
            <span className="material-symbols-outlined text-3xl text-primary mb-3 block">check_circle</span>
            <h3 className="font-title-lg text-base text-on-surface mb-1">Curated Quality</h3>
            <p className="text-xs text-on-surface-variant">Hand-picked selections evaluated for texture, color vibrancy, and authentic fabric feel.</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-xs">
            <span className="material-symbols-outlined text-3xl text-primary mb-3 block">local_shipping</span>
            <h3 className="font-title-lg text-base text-on-surface mb-1">Customer Delivery</h3>
            <p className="text-xs text-on-surface-variant">Secure domestic parcel dispatch across India with clear, transparent customer-paid delivery.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-on-surface">Visit or Contact Us:</p>
            <p className="text-xs text-on-surface-variant">Shahdara, Delhi, 110093 · sanskritisareeemail@gmail.com</p>
          </div>
          <Link
            href="/products"
            className="px-6 py-3 bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest rounded-lg hover:bg-tertiary-container transition-colors shadow-md text-center"
          >
            Explore Saree Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
