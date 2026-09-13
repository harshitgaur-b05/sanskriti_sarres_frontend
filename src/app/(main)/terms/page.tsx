import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Sanskriti Sarees Mill",
  description: "Read the Terms and Conditions for purchasing authentic handloom drapes from Sanskriti Sarees Mill.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-on-surface">
      <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Terms & Conditions</h1>
      <p className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-8">
        Effective Date: September 13, 2026 | Sanskriti Sarees Mill
      </p>

      <div className="space-y-6 font-body-md text-sm text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">1. Agreement to Terms</h2>
          <p>
            By accessing or placing an order with Sanskriti Sarees Mill, you agree to be bound by these Terms & Conditions. Please read them carefully before making a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">2. Authentic Handloom Weaves Notice</h2>
          <p>
            Our sarees are crafted using traditional handloom weaving techniques. Slight variations in weave texture, slubs, or color shading are characteristic features of authentic handloom silk and not manufacturing defects.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">3. Pricing & Payments</h2>
          <p>
            All prices listed on the site are in Indian Rupees (INR) and include applicable taxes unless stated otherwise. Prices are subject to change without notice. Payments are securely processed via Razorpay or Cash on Delivery (COD) where available.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">4. Orders & Availability</h2>
          <p>
            All orders are subject to stock availability. In the rare event an ordered piece is out of stock, we will notify you promptly and process a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">5. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India, under the jurisdiction of courts in Uttar Pradesh.
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
