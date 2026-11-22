import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Sanskriti Sarees Mill",
  description: "Learn how Sanskriti Sarees Mill collects, uses, and safeguards customer personal data in compliance with Indian privacy laws.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-on-surface">
      <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-3">Privacy Policy</h1>
      <p className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-8">
        Last Updated: November 2026 | Sanskriti Sarees Mill
      </p>

      <div className="space-y-8 font-body-md text-sm text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">1. Introduction & Business Identity</h2>
          <p>
            Sanskriti Sarees Mill ("we", "our", or "us") operates the website{" "}
            <a href="https://sanskriti-sarres-frontend.vercel.app/" className="text-primary underline">
              https://sanskriti-sarres-frontend.vercel.app/
            </a>. We are a local saree retail shop operating from:
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 my-3 text-xs text-on-surface">
            <p><strong>Business Name:</strong> Sanskriti Sarees Mill</p>
            <p><strong>Address:</strong> D 663, Main 100 Feet Rd, Chanderlok Colony, Durgapuri Extension, Chanderlok, Shahdara, Delhi, 110032, India</p>
            <p><strong>Contact Email:</strong> <a href="mailto:sanskritisareeemail@gmail.com" className="underline text-primary">sanskritisareeemail@gmail.com</a></p>
          </div>
          <p>
            We are dedicated to safeguarding the privacy and personal data of our customers in accordance with the Information Technology Act, 2000, applicable Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the principles of the Digital Personal Data Protection Act, 2023.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">2. Personal Information We Collect</h2>
          <p>
            We collect only the personal information required to process your purchase, arrange delivery, and provide customer support. This includes:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Customer Contact Details:</strong> Full name, email address, telephone/mobile number.</li>
            <li><strong>Delivery & Billing Details:</strong> Postal address, apartment/suite, city, state, PIN code, and country (India).</li>
            <li><strong>Order History:</strong> Product names, quantities, billing totals, order status, and order identifiers.</li>
            <li><strong>Technical & Browsing Data:</strong> Standard server logs, IP address, device type, and browser user-agent to monitor performance and prevent fraudulent activity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">3. Purpose and Legal Basis for Processing</h2>
          <p>We process your personal information strictly for legitimate commercial purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>To verify, process, and fulfill your saree orders.</li>
            <li>To coordinate shipping and package handover with domestic courier services.</li>
            <li>To communicate order status, dispatch updates, and customer support responses.</li>
            <li>To prevent duplicate orders, fraud, and unauthorized platform access.</li>
            <li>To comply with applicable Indian tax and consumer protection legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">4. Payment Processing & Financial Security</h2>
          <p>
            All online digital transactions on Sanskriti Sarees Mill are conducted through authorized and accredited third-party payment gateway service providers (such as Razorpay).
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 my-3 text-xs text-on-surface space-y-1">
            <p><strong>Payment Security Notice:</strong></p>
            <p>• Sanskriti Sarees Mill <strong>never collects, stores, or processes</strong> full debit/credit card numbers, CVVs, expiry dates, net-banking passwords, or UPI PINs on its own servers.</p>
            <p>• Payment details are encrypted and transmitted directly to the PCI-DSS compliant payment gateway under secure protocols.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">5. Data Sharing with Third Parties</h2>
          <p>
            We respect your privacy and <strong>do not sell, rent, trade, or monetize</strong> your personal data. Personal information is disclosed exclusively to trusted third-party providers under strict confidentiality:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Logistics & Delivery Partners:</strong> Recipient name, destination delivery address, and telephone number are shared solely for courier delivery within India.</li>
            <li><strong>Payment Gateways:</strong> Order amount and transaction metadata are shared to generate payment links and verify payment completion.</li>
            <li><strong>Legal & Regulatory Authorities:</strong> Where required by valid legal process, judicial order, or applicable Indian law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">6. Data Retention & Customer Privacy Rights</h2>
          <p>
            We retain personal data relating to completed orders only as long as necessary to fulfill delivery, handle customer service or return queries, and satisfy statutory tax and accounting record-keeping requirements under Indian law.
          </p>
          <p className="mt-2">
            You have the right to request access to the personal data we hold about you, request rectification of any inaccurate information, or request deletion of non-essential records by writing to our official contact email.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">7. Grievance Officer & Contact Information</h2>
          <p>
            If you have any questions, concerns, or grievances regarding this Privacy Policy or the handling of your data, please contact:
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 mt-3 text-xs text-on-surface space-y-1">
            <p><strong>Sanskriti Sarees Mill</strong></p>
            <p>Attn: Customer Privacy & Grievance Cell</p>
            <p>D 663, Main 100 Feet Rd, Chanderlok Colony, Durgapuri Extension, Chanderlok, Shahdara, Delhi, 110032, India</p>
            <p>Email: <a href="mailto:sanskritisareeemail@gmail.com" className="text-primary underline">sanskritisareeemail@gmail.com</a></p>
            <p className="text-[11px] text-on-surface-variant">We endeavor to acknowledge customer privacy grievances within 48 hours and resolve them in accordance with applicable legal guidelines.</p>
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
