import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Sanskriti Sarees Mill",
  description: "Learn how Sanskriti Sarees Mill protects and handles your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-on-surface">
      <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Privacy Policy</h1>
      <p className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-8">
        Effective Date: September 13, 2026 | Sanskriti Sarees Mill
      </p>

      <div className="space-y-6 font-body-md text-sm text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">1. Overview</h2>
          <p>
            Sanskriti Sarees Mill ("we", "our", or "us") is committed to safeguarding the privacy of our visitors and customers. This Privacy Policy explains how your personal information is collected, used, and protected when you visit or make a purchase from our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">2. Information We Collect</h2>
          <p>
            When you visit our site or place an order, we collect information necessary to process your purchase and deliver our authentic handloom drapes. This includes:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Personal Identifiers: Name, email address, phone number, shipping and billing address.</li>
            <li>Transaction Details: Payment method preference, order history, and purchased saree items.</li>
            <li>Technical Data: IP address, browser type, and device information for security and site optimization.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Processing, fulfilling, and delivering your handloom saree orders.</li>
            <li>Processing secure payments through accredited payment gateways like Razorpay.</li>
            <li>Communicating order confirmations, tracking updates, and customer support responses.</li>
            <li>Preventing fraudulent transactions and maintaining website security.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">4. Payment & Data Security</h2>
          <p>
            All payment processing is handled securely by PCI-DSS compliant third-party payment gateways (such as Razorpay). Sanskriti Sarees Mill does not store or process sensitive credit card numbers, CVVs, or banking credentials on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">5. Sharing Your Information</h2>
          <p>
            We do not sell, rent, or trade your personal information. We only share data with trusted third-party service providers (such as logistics/courier partners and payment processors) solely for order fulfillment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-2">6. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact our support team at:
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 mt-3 text-xs text-on-surface">
            <p><strong>Sanskriti Sarees Mill</strong></p>
            <p>Varanasi Weaving Division, Uttar Pradesh, India</p>
            <p>Email: support@sanskritisarees.com</p>
            <p>Phone: +91 98765 43210</p>
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
