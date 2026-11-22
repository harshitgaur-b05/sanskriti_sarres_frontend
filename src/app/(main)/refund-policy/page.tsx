import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Returns, Refunds & Cancellation Policy | Sanskriti Sarees Mill",
  description: "Read the clear, compliant Return, Refund, and Cancellation Policy for Sanskriti Sarees Mill in Shahdara, Delhi.",
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-on-surface">
      <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-3">
        Returns, Refunds & Cancellation Policy
      </h1>
      <p className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-8">
        Last Updated: November 2026 | Sanskriti Sarees Mill
      </p>

      <div className="space-y-8 font-body-md text-sm text-on-surface-variant leading-relaxed">
        <section>
          <p className="leading-relaxed">
            At Sanskriti Sarees Mill, we take pride in presenting carefully curated traditional and festive sarees. This policy details our cancellation, return, and refund procedures, balancing clear commercial rules with our strict commitment to honoring statutory consumer rights under the Consumer Protection Act, 2019 and the Consumer Protection (E-Commerce) Rules.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">1. Order Cancellation (Before Dispatch)</h2>
          <p>
            You may request an order cancellation at any time prior to package dispatch.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>To request cancellation, please email <a href="mailto:sanskritisareeemail@gmail.com" className="text-primary underline">sanskritisareeemail@gmail.com</a> with your order number.</li>
            <li>If the order has not been handed over to the courier, we will cancel the order immediately and initiate a 100% full refund to your original payment method.</li>
            <li>Once an order has been dispatched, cancellation is no longer possible and the standard return guidelines below will apply.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">2. Damaged, Defective, or Incorrect Products</h2>
          <p>
            If you receive a package that contains a damaged item, a manufacturing defect, or a product materially different from what you ordered:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Reporting Window:</strong> We encourage customers to report issues within <strong>48 hours of delivery</strong> to assist with prompt investigation and courier verification. (Note: this reporting guideline does not restrict your mandatory statutory rights under Indian consumer law).</li>
            <li><strong>How to Report:</strong> Email <a href="mailto:sanskritisareeemail@gmail.com" className="text-primary underline">sanskritisareeemail@gmail.com</a> with:
              <ul className="list-circle pl-6 mt-1 space-y-0.5 text-xs">
                <li>Your Order Number.</li>
                <li>Clear photographs/video showing the damaged or incorrect area.</li>
                <li>A photo of the outer courier shipping label.</li>
                <li>A brief description of the issue.</li>
              </ul>
            </li>
            <li><strong>Resolution:</strong> Upon verification, we will offer you an immediate replacement of the item or a full refund.</li>
            <li><strong>Return Shipping Costs:</strong> For valid damaged, defective, or incorrect product claims, <strong>the customer will not bear the return shipping cost</strong>. We will arrange a reverse pickup or reimburse reasonable standard courier charges.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">3. Change-of-Mind Returns</h2>
          <p>
            As a local saree retail shop selling unstitched drapes, we do not offer routine returns simply because a customer changes their mind, has a personal color preference change, or no longer requires the piece, unless voluntarily approved by the shop owner as an exception.
          </p>
          <p className="mt-2 text-xs">
            *Where a voluntary change-of-mind exception is approved by the shop, the customer will be responsible for safe return shipping of the unused, unstitched item in its original condition and packaging.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">4. Refund Processing Timeline</h2>
          <p>
            When a refund is approved:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Refunds are credited directly to the <strong>original payment method</strong> used during checkout (via the payment gateway).</li>
            <li>Once initiated by us, banking channels and payment networks typically reflect the credited amount in your account within <strong>5 to 10 business days</strong>, subject to your issuing bank's settlement cycle.</li>
            <li>We do not charge any unauthorized cancellation or processing penalties.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">5. Important Consumer Protection Assurance</h2>
          <p>
            Nothing in this policy is intended to limit or exclude any statutory rights, warranties, or remedies available to consumers under the Consumer Protection Act, 2019, applicable Consumer Protection (E-Commerce) Rules, or other applicable Indian laws.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">6. Contact for Return & Refund Queries</h2>
          <p>
            To initiate a return inquiry or follow up on a pending refund:
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 mt-3 text-xs text-on-surface space-y-1">
            <p><strong>Sanskriti Sarees Mill</strong></p>
            <p>D 663, Main 100 Feet Rd, Chanderlok Colony, Durgapuri Extension, Chanderlok, Shahdara, Delhi, 110093, India</p>
            <p>Official Email: <a href="mailto:sanskritisareeemail@gmail.com" className="text-primary underline">sanskritisareeemail@gmail.com</a></p>
          </div>
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
