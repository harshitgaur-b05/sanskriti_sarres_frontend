import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Shipping & Delivery Policy | Sanskriti Sarees Mill",
  description: "Learn about delivery charges, domestic timelines, order processing, and tracking for Sanskriti Sarees Mill in Shahdara, Delhi.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-on-surface">
      <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-3">Shipping & Delivery Policy</h1>
      <p className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-8">
        Last Updated: November 2026 | Sanskriti Sarees Mill
      </p>

      <div className="space-y-8 font-body-md text-sm text-on-surface-variant leading-relaxed">
        <section>
          <p className="leading-relaxed">
            Sanskriti Sarees Mill aims to deliver customer orders safely, securely, and within an estimated domestic timeframe. Please review our shipping terms below.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">1. Shipping Charges (100% Customer-Paid Delivery)</h2>
          <div className="bg-amber-500/10 border border-amber-600/30 p-4 rounded-lg text-xs text-on-surface mb-3">
            <strong>Mandatory Policy Notice:</strong> All shipping and delivery charges are payable 100% by the customer only. There is strictly no free delivery or complimentary shipping on any clothing or saree orders. Shipping charges are completely separate from product prices and are itemized transparently in the order summary before payment.
          </div>
          <p>
            Standard domestic insured courier delivery across India is charged at a flat rate of ₹150 per order (or communicated/calculated based on order parcel weight and courier rates). The applicable delivery fee is paid by the customer during checkout.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">2. Strictly 100% Prepaid Orders (No Cash on Delivery)</h2>
          <p>
            Sanskriti Sarees Mill operates strictly on a <strong>100% prepaid order model</strong>. All orders must be fully paid online via our secure Razorpay gateway (UPI, Credit/Debit Cards, Net Banking) before dispatch.
          </p>
          <p className="mt-2 text-rose-800 font-semibold text-xs">
            We do NOT offer Cash on Delivery (COD) or pay-on-arrival under any circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">3. Order Processing & Verification</h2>
          <p>
            Orders are processed only after payment confirmation and inventory verification.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Processing Window:</strong> Standard orders are typically inspected and packed within 1 to 3 business days (excluding Sundays and national holidays).</li>
            <li><strong>Order Confirmation:</strong> An email confirmation containing your order reference is sent to your registered email immediately upon successful payment.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">3. Delivery Coverage & Timelines</h2>
          <p>
            We ship to serviceable domestic PIN codes across India via standard surface and air courier channels.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Delhi-NCR:</strong> Approximately 2 to 4 business days post-dispatch.</li>
            <li><strong>Metro Cities & Major Hubs:</strong> Approximately 3 to 5 business days post-dispatch.</li>
            <li><strong>Rest of India / Regional Areas:</strong> Approximately 4 to 7 business days post-dispatch.</li>
            <li><strong>International Shipping:</strong> We currently operate domestic shipping only within India and do not offer international delivery.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">4. Order Tracking</h2>
          <p>
            Once your package is handed over to the courier service, we will share the courier tracking number (AWB) and delivery link via email so you can monitor your parcel's journey.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">5. Delivery Delays Beyond Control</h2>
          <p>
            While we partner with reputable courier providers to ensure timely transit, delivery delays may occasionally arise due to severe weather, logistics strikes, local lockdowns, festive peak loads, or force majeure events. We will actively coordinate with the courier partner to expedite resolution in such situations.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">6. Accurate Customer Delivery Information</h2>
          <p>
            Customers are responsible for providing complete and accurate shipping information, including the recipient's name, full street address, landmark, valid PIN code, and active mobile number. Sanskriti Sarees Mill is not liable for failed delivery attempts or redirection charges resulting from inaccurate or incomplete customer-entered addresses.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-on-surface mb-2">7. Delivery Enquiries & Customer Support</h2>
          <p>
            For any questions regarding shipping status, dispatch, or delivery charges, please contact:
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 mt-3 text-xs text-on-surface space-y-1">
            <p><strong>Sanskriti Sarees Mill</strong></p>
            <p>D 663, Main 100 Feet Rd, Chanderlok Colony, Durgapuri Extension, Chanderlok, Shahdara, Delhi, 110032, India</p>
            <p>Email: <a href="mailto:sanskritisareeemail@gmail.com" className="text-primary underline">sanskritisareeemail@gmail.com</a></p>
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
