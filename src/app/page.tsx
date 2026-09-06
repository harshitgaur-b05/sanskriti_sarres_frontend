import Link from "next/link";
import { priceCategories, mockProducts } from "@/lib/mockData";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-surface-container-highest">
        <div className="relative min-h-[85vh] lg:min-h-[720px] flex flex-col justify-end lg:justify-center items-center lg:items-start">
          <div className="absolute inset-0 w-full h-full">
            <img 
              alt="Modern Indian bride in a royal maroon and gold Banarasi handwoven silk saree" 
              className="w-full h-full object-cover object-center transform scale-105 duration-1000 transition-transform hover:scale-100" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9FVxUi3Y1nNNs7H1Zt5zeaeoiALg-NVh2_3FvcpTH0uNI8fQOaYB2oST_mOrBCGriC7cG55OxjO3tme1FTlm9pKCzlQ3vdh6LYAi1TakRJB8He2BXR7puhv8r18KQI8K5JvVDSJ4i11kEo49iNugV8gcLxIc7Ix8s6MNRyZvWwAWHGDFD7HuaevyAr7W1CTtvHnDAVTDWyjB6ppmAB-ZNrc1lSaORB9KWPP8Fwv2jwUNClNjy2WGs8g"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-surface-container-lowest/95 via-surface-container/70 to-transparent lg:w-3/5"></div>
          </div>
          <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full py-16 lg:py-24 text-center lg:text-left">
            <div className="max-w-xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-lowest/95 backdrop-blur-sm rounded-full mb-6 shadow-sm">
                <span className="font-label-md text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-on-surface">New Collection</span>
              </div>
              <h1 className="font-headline-lg lg:font-display-md text-headline-lg-mobile md:text-headline-lg lg:text-display-md text-on-surface mb-6 leading-none">
                Threads of <br className="hidden lg:block"/>
                <span className="font-display-md font-light lg:ml-2">India</span>
              </h1>
              <p className="font-body-md md:font-body-lg text-sm md:text-body-lg text-on-surface-variant mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Where archival heritage meets the modern drape. A curation of timeless silhouettes woven for generations.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 mb-4 lg:mb-12">
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary font-label-md text-xs uppercase tracking-[0.15em] hover:bg-tertiary-container transition-all duration-300 shadow-md hover:shadow-xl w-full sm:w-auto"
                >
                  Explore Archives
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Price Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-surface px-margin-mobile md:px-margin-desktop" id="shop-by-price">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col mb-8 md:mb-12 items-center md:items-start text-center md:text-left">
            <h2 className="font-headline-md md:font-headline-lg text-2xl md:text-headline-lg text-on-surface">Shop by Price</h2>
            <p className="font-body-md text-xs md:text-body-md text-on-surface-variant max-w-xl mt-2">
              Accessible handloom elegance to generational museum-grade heirlooms. Explore our authentic handwoven edits grouped by budget.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
            {priceCategories.map((cat) => (
              <Link 
                key={cat.id} 
                href="/products"
                className="group flex flex-col bg-surface-container-lowest p-2 md:p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden mb-3 bg-surface-container rounded-sm">
                  <img 
                    src={cat.image} 
                    alt={cat.label} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-title-lg text-sm md:text-lg text-on-surface group-hover:text-primary transition-colors leading-tight">{cat.label}</h3>
                  <p className="font-label-md text-[8px] md:text-[9px] uppercase tracking-widest text-on-surface-variant mt-1 hidden sm:block">{cat.sublabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-surface-container-low px-margin-mobile md:px-margin-desktop" id="bestsellers">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 text-center md:text-left">
            <div>
              <span className="font-label-md text-[10px] md:text-xs uppercase tracking-[0.25em] text-on-surface-variant block mb-2">Curated Releases</span>
              <h2 className="font-headline-md md:font-headline-lg text-2xl md:text-headline-lg text-on-surface">Top Sellers & New Handlooms</h2>
            </div>
            <Link href="/products" className="mt-4 md:mt-0 inline-flex items-center justify-center gap-2 font-label-md text-xs uppercase tracking-widest text-on-surface hover:text-outline transition-colors group">
              <span>View All Editions</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {mockProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="group bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-primary text-on-primary px-2.5 py-1 text-[9px] md:text-[10px] font-label-md uppercase tracking-wider rounded-sm font-semibold">{product.tags[0]}</span>
                  </div>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1 text-center">
                  <span className="text-[9px] md:text-[11px] font-caption text-on-surface-variant uppercase tracking-widest mb-1">{product.category}</span>
                  <h3 className="font-headline-md text-base md:text-lg text-on-surface mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-auto">
                    <span className="font-body-md text-sm md:text-base font-semibold text-on-surface">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && <span className="font-body-md text-xs text-on-surface-variant line-through">₹{product.originalPrice.toLocaleString()}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Collection Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-surface px-margin-mobile md:px-margin-desktop" id="wedding-collection">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 relative order-2 lg:order-1">
              <div className="rounded-xl overflow-hidden shadow-xl bg-surface-container">
                <img alt="Editorial bride showcasing Sankriti bespoke wedding collection saree" className="w-full h-auto object-cover aspect-[4/3] lg:aspect-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9FVxUi3Y1nNNs7H1Zt5zeaeoiALg-NVh2_3FvcpTH0uNI8fQOaYB2oST_mOrBCGriC7cG55OxjO3tme1FTlm9pKCzlQ3vdh6LYAi1TakRJB8He2BXR7puhv8r18KQI8K5JvVDSJ4i11kEo49iNugV8gcLxIc7Ix8s6MNRyZvWwAWHGDFD7HuaevyAr7W1CTtvHnDAVTDWyjB6ppmAB-ZNrc1lSaORB9KWPP8Fwv2jwUNClNjy2WGs8g"/>
              </div>
              <div className="absolute -bottom-4 right-4 md:-bottom-6 md:-right-4 lg:right-8 bg-surface-container-lowest p-4 md:p-6 rounded-lg shadow-xl max-w-[240px] md:max-w-xs border border-surface-container">
                <span className="font-label-md text-[8px] md:text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Couture Service</span>
                <p className="font-headline-md text-sm md:text-base text-on-surface leading-tight">"The Muhurtham drape made my wedding feel like an archival royal portrait."</p>
              </div>
            </div>
            
            <div className="lg:col-span-5 lg:pl-6 order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full mb-4">
                <span className="material-symbols-outlined text-sm text-tertiary-container">favorite</span>
                <span className="font-label-md text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-on-surface">Curated Bridal Trousseau</span>
              </div>
              <h2 className="font-headline-md md:font-headline-lg text-3xl md:text-headline-lg text-on-surface mb-4 leading-tight">
                The Sanctum of Wedding Heirlooms
              </h2>
              <p className="font-body-md text-sm md:text-body-md text-on-surface-variant mb-8 leading-relaxed">
                From sunrise Muhurtham ceremonies wrapped in heavy pure gold zari Kanjeevarams to evening Receptions glowing under champagne Banarasi Kadhuwas. We curate your multi-day bridal wardrobe directly with hereditary weavers.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-surface-container-low p-4 rounded-md">
                  <span className="font-headline-md text-sm md:text-base text-on-surface block mb-1">Muhurtham</span>
                  <p className="font-caption text-xs text-on-surface-variant">Heavy Kanjivaram Korvai with pure temple zari borders</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-md">
                  <span className="font-headline-md text-sm md:text-base text-on-surface block mb-1">Reception</span>
                  <p className="font-caption text-xs text-on-surface-variant">Regal Kadhuwa Banarasis with antique zari bootas</p>
                </div>
              </div>
              
              <Link href="/products" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-tertiary-container transition-colors shadow-md w-full sm:w-auto">
                Explore Bridal Silks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-surface-container-lowest border-t border-outline-variant/20 px-margin-mobile md:px-margin-desktop" id="about">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label-md text-[10px] md:text-xs uppercase tracking-[0.25em] text-on-surface-variant block mb-4">The Mill Story</span>
          <h2 className="font-headline-md md:font-headline-lg text-2xl md:text-headline-lg text-on-surface mb-6">Preserving Generational Weaves</h2>
          <p className="font-body-md md:font-body-lg text-sm md:text-body-lg text-on-surface-variant mb-10 leading-relaxed">
            For decades, Sankriti Sarees Mill has worked alongside the master artisans of Varanasi to revive and sustain the intricate art of handloom weaving. We bypass intermediaries to bring museum-grade archival textiles directly to you, ensuring fair wages for weavers and authentic, uncompromised quality for every drape.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-4 bg-surface-container-low px-6 py-4 rounded-full w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-xl">texture</span>
              </div>
              <div className="text-left">
                <h4 className="font-label-md text-[10px] md:text-xs uppercase tracking-widest text-on-surface">Tactile Weave Guarantee</h4>
                <p className="font-caption text-[9px] md:text-[10px] text-on-surface-variant">Certified Silk Mark verification</p>
              </div>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 font-label-md text-xs uppercase tracking-widest text-on-surface hover:text-primary transition-colors">
              <span>Read Our Weave Standard</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* All Products Bottom CTA */}
      <section className="py-16 md:py-24 bg-primary text-on-primary text-center px-margin-mobile md:px-margin-desktop">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline-md md:font-headline-lg text-3xl md:text-headline-lg mb-6">Discover the Full Archive</h2>
          <p className="font-body-md text-sm md:text-base text-surface-dim mb-8">Browse our entire collection of handwoven sarees, organized by craft, region, and occasion.</p>
          <Link href="/products" className="inline-flex items-center justify-center px-10 py-4 bg-surface text-on-surface font-label-md text-xs uppercase tracking-widest hover:bg-surface-container-high transition-colors shadow-lg">
            Shop All Products
          </Link>
        </div>
      </section>
    </>
  );
}