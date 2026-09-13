import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Return, Refund & Cancellation Policy | Sanskriti Sarees Mill",
  description: "Read our Return, Refund, and Cancellation Policy for authentic handloom sarees.",
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-on-surface">
      <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">
        Return, Refund & Cancellation Policy
      </h1>
      <p className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-8">
        Effective Date: September 13, 2026 | Sanskriti Sarees Mill
      </p>

      <div className="space-y-6 font-body-md text-sm text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">1. Cancellation Policy</h2>
          <p>
            You can request order cancellation within <strong>24 hours</strong> of placing your order or before the product has been dispatched (whichever is earlier) by contacting support@sanskritisarees.com. Full refunds are processed to the original payment source.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">2. Return & Exchange Guidelines</h2>
          <p>
            We offer a 7-day hassle-free return/exchange policy for damaged, defective, or incorrect items received. Returned pieces must be unused, in original fold, with silk mark tags intact.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">3. Refund Processing Timeline</h2>
          <p>
            Once returned items are inspected at our Varanasi warehouse, approved refunds are credited back to your original payment account (via Razorpay) within <strong>5 to 7 business days</strong>.
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
