import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Sanskriti Sarees Mill",
  description: "Read the Terms and Conditions for purchasing sarees from Sanskriti Sarees Mill in Shahdara, Delhi.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-on-surface">
      <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-3">Terms & Conditions of Service</h1>
      <p className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-8">
        Last Updated: November 2026 | Sanskriti Sarees Mill
      </p>

      <div className="space-y-8 font-body-md text-sm text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">1. Business Identity & Acceptance</h2>
          <p>
            Welcome to Sanskriti Sarees Mill. These Terms & Conditions ("Terms") govern your use of our website located at{" "}
            <a href="https://sanskriti-sarres-frontend.vercel.app/" className="text-primary underline">
              https://sanskriti-sarres-frontend.vercel.app/
            </a>{" "}
            and any purchase of goods made through it.
          </p>
          <p className="mt-2">
            Sanskriti Sarees Mill is a local saree retail shop located at:
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 my-3 text-xs text-on-surface">
            <p><strong>Shop Name:</strong> Sanskriti Sarees Mill</p>
            <p><strong>Location:</strong> D 663, Main 100 Feet Rd, Chanderlok Colony, Durgapuri Extension, Chanderlok, Shahdara, Delhi, 110032, India</p>
            <p><strong>Official Email:</strong> <a href="mailto:sanskritisareeemail@gmail.com" className="underline text-primary">sanskritisareeemail@gmail.com</a></p>
          </div>
          <p>
            By visiting or placing an order on our website, you agree to comply with and be bound by these Terms and our related store policies.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">2. Products & Descriptions</h2>
          <p>
            We curate and sell traditional, bridal, and festive sarees.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Unstitched Sarees:</strong> All sarees sold on this website are unstitched drapes. We do not provide blouse stitching, fall, edging, or picot services.</li>
            <li><strong>Color & Texture Representation:</strong> We make every effort to display the colors and weaves of our sarees accurately. However, slight variations in shade or texture may appear due to monitor settings, screen calibrations, and digital photography lighting.</li>
            <li><strong>Handcrafted Nuances:</strong> Traditional and hand-finished textiles naturally exhibit minor slubs, irregular weaving patterns, and subtle thread variations that form part of their authentic character.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">3. Pricing & Taxes</h2>
          <p>
            All prices listed on the website are denominated in Indian Rupees (₹ / INR). Product prices displayed in the catalog are inclusive of applicable retail prices and disclosed transparently. Prices are subject to revision without prior notice, but any change will not affect orders that have already been confirmed.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">4. Orders, Stock Availability & Acceptance</h2>
          <p>
            Placing an order constitutes an offer to purchase. An order is confirmed once payment has been received and verified by our system.
          </p>
          <p className="mt-2">
            All orders are subject to product availability. In the rare event an item is found to be out of stock or unavailable following order placement, we will contact you promptly and process a full refund to your original payment method.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">5. Shipping & Delivery Charges (100% Customer-Paid)</h2>
          <p>
            <strong>All shipping and delivery charges are payable 100% by the customer only.</strong> We do not offer free delivery or complimentary shipping on any saree or clothing orders. Shipping fees are separate from the product price and are transparently communicated and displayed in the checkout order summary before payment is completed.
          </p>
          <p className="mt-2">
            Delivery timelines are estimates (typically 3–7 business days within India). Deliveries are restricted to serviceable domestic PIN codes within India. For detailed terms, please review our{" "}
            <Link href="/shipping-policy" className="text-primary underline">
              Shipping & Delivery Policy
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">6. Order Cancellation, Returns & Statutory Remedies</h2>
          <p>
            Customers may request cancellation of an order before it has been dispatched by emailing us at{" "}
            <a href="mailto:sanskritisareeemail@gmail.com" className="text-primary underline">
              sanskritisareeemail@gmail.com
            </a>.
          </p>
          <p className="mt-2">
            As a local retail shop, routine change-of-mind returns are not offered as a standard facility unless voluntarily agreed by the shop. However, if a customer receives a damaged, defective, or incorrect product, they are entitled to an appropriate remedy (replacement or refund) in full accordance with the Consumer Protection Act, 2019 and Consumer Protection (E-Commerce) Rules.
          </p>
          <p className="mt-2">
            Please refer to our dedicated{" "}
            <Link href="/refund-policy" className="text-primary underline">
              Returns & Refunds Policy
            </Link>{" "}
            for complete guidelines on reporting and resolving product issues.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">7. Supported Payment Methods (Strictly 100% Prepaid Online)</h2>
          <p>
            All orders placed on Sanskriti Sarees Mill must be <strong>100% prepaid online</strong> via our secure, accredited payment gateway (Razorpay) supporting UPI, Debit/Credit Cards, and Net Banking prior to order dispatch.
          </p>
          <p className="mt-2 font-semibold text-rose-800">
            Cash on Delivery (COD) is not accepted or offered.
          </p>
          <p className="mt-2">
            We do not store sensitive payment card credentials on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">8. Governing Law & Jurisdiction</h2>
          <p>
            These Terms of Service and any transaction entered into shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Delhi, India</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">9. Customer Support & Grievances</h2>
          <p>
            For any inquiries, feedback, or grievance redressal, please reach out to:
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 mt-3 text-xs text-on-surface">
            <p><strong>Sanskriti Sarees Mill</strong></p>
            <p>D 663, Main 100 Feet Rd, Chanderlok Colony, Durgapuri Extension, Chanderlok, Shahdara, Delhi, 110032, India</p>
            <p>Email: <a href="mailto:sanskritisareeemail@gmail.com" className="underline text-primary">sanskritisareeemail@gmail.com</a></p>
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
