export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 text-center">
      <span className="font-label-md text-[10px] md:text-xs uppercase tracking-[0.25em] text-on-surface-variant block mb-4">The Mill Story</span>
      <h1 className="font-headline-lg lg:font-display-md text-headline-lg-mobile md:text-headline-lg lg:text-display-md text-on-surface mb-8">Preserving Generational Weaves</h1>
      <p className="font-body-md md:font-body-lg text-sm md:text-body-lg text-on-surface-variant mb-8 leading-relaxed text-left md:text-center">
        For decades, Sankriti Sarees Mill has worked alongside the master artisans of Varanasi to revive and sustain the intricate art of handloom weaving. We bypass intermediaries to bring museum-grade archival textiles directly to you, ensuring fair wages for weavers and authentic, uncompromised quality for every drape.
      </p>
       <p className="font-body-md md:font-body-lg text-sm md:text-body-lg text-on-surface-variant mb-12 leading-relaxed text-left md:text-center">
        Our commitment extends beyond commerce; it's a dedication to the cultural heritage of India. Every thread woven in our looms tells a story of tradition, meticulous craftsmanship, and an enduring passion for textile art. We invite you to be a part of this journey, to drape yourself in history, and to pass these heirlooms down through generations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="bg-surface-container p-6 rounded-md shadow-sm">
            <span className="material-symbols-outlined text-3xl text-primary mb-4 block">handshake</span>
            <h3 className="font-title-lg text-lg text-on-surface mb-2">Direct from Artisans</h3>
            <p className="font-body-md text-sm text-on-surface-variant">We work directly with weaving communities, ensuring they receive the recognition and compensation they deserve.</p>
          </div>
          <div className="bg-surface-container p-6 rounded-md shadow-sm">
             <span className="material-symbols-outlined text-3xl text-primary mb-4 block">verified</span>
            <h3 className="font-title-lg text-lg text-on-surface mb-2">Authentic Quality</h3>
            <p className="font-body-md text-sm text-on-surface-variant">Every saree undergoes rigorous quality checks and comes with a tactile weave guarantee and Silk Mark certification.</p>
          </div>
          <div className="bg-surface-container p-6 rounded-md shadow-sm">
             <span className="material-symbols-outlined text-3xl text-primary mb-4 block">history_edu</span>
            <h3 className="font-title-lg text-lg text-on-surface mb-2">Archival Designs</h3>
            <p className="font-body-md text-sm text-on-surface-variant">We specialize in reviving rare, vintage motifs, bringing historical elegance into modern wardrobes.</p>
          </div>
      </div>
    </div>
  );
}
