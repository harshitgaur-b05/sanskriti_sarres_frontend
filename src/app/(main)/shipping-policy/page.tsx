import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Shipping & Delivery Policy | Sanskriti Sarees Mill",
  description: "Learn about delivery timelines, shipping charges, and tracking for Sanskriti Sarees Mill.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-on-surface">
      <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Shipping & Delivery Policy</h1>
      <p className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-8">
        Effective Date: September 13, 2026 | Sanskriti Sarees Mill
      </p>

      <div className="space-y-6 font-body-md text-sm text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">1. Delivery Coverage</h2>
          <p>
            Sanskriti Sarees Mill delivers authentic handloom sarees across India and to select international destinations. All domestic shipments are dispatched via reputed courier partners with insured tracking.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">2. Processing & Dispatch Timeline</h2>
          <p>
            Orders are processed and dispatched within 1 to 2 business days from our Varanasi weaving house. Once dispatched, domestic delivery typically takes 2 to 5 business days depending on destination PIN code.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">3. Shipping Charges</h2>
          <p>
            We offer <strong>Free Standard Express Shipping</strong> on all prepaid domestic orders within India. Shipping fees for international orders are calculated at checkout based on weight and country destination.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">4. Order Tracking</h2>
          <p>
            Once your order is handed over to our shipping partner, you will receive an SMS and email notification containing your unique Tracking AWB Number and delivery link.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-outline-variant/30 pt-6">
        <Link href="/" className="text-xs uppercase tracking-widest text-primary font-bold hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
