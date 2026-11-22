"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

// Razorpay global types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (r: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const INDIAN_STATES = [
  "Delhi",
  "Uttar Pradesh",
  "Haryana",
  "Punjab",
  "Rajasthan",
  "Maharashtra",
  "Gujarat",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
  "Madhya Pradesh",
  "Bihar",
  "Kerala",
  "Other State / UT",
];

type CheckoutStatus = "idle" | "processing" | "success" | "failed";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "Delhi",
    pincode: "",
    phone: "",
    sendCatalog: true, // Checkbox for confirming to send catalog
    paymentMethod: "RAZORPAY",
    billingSameAsShipping: true,
  });

  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderReceipt, setOrderReceipt] = useState<{
    orderNumber: string;
    paymentId: string;
    customerEmail: string;
    totalAmount: number;
  } | null>(null);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  // Final amount at checkout (Product amount prepaid; delivery charge discussed and confirmed by owner later)
  const finalPayableAmount = totalPrice;

  // Verify payment with server
  const verifyAndFinish = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderNum: string,
    paidAmount: number
  ) => {
    try {
      const verifyRes = await fetch(`${BACKEND_URL}/api/orders/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
      });
      const data = await verifyRes.json();
      if (data.success || data.order) {
        setOrderReceipt({
          orderNumber: orderNum || data.order?.orderNumber || `SAN-${Date.now()}`,
          paymentId: razorpayPaymentId,
          customerEmail: form.email,
          totalAmount: paidAmount,
        });
        setStatus("success");
        clearCart();
      } else {
        setErrorMsg("Payment verification could not be confirmed. Please contact support with Payment ID: " + razorpayPaymentId);
        setStatus("failed");
      }
    } catch {
      setErrorMsg("Error verifying payment with server. Please reach out to sanskritisareeemail@gmail.com.");
      setStatus("failed");
    }
  };

  // Submit checkout
  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.lastName || !form.address || !form.city || !form.phone || !form.pincode) {
      setErrorMsg("Please complete all required fields (Email, Last name, Address, City, State, PIN code, Phone).");
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Your shopping cart is empty.");
      return;
    }

    setErrorMsg("");
    setStatus("processing");

    const fullCustomerName = `${form.firstName} ${form.lastName}`.trim();
    const fullAddressString = `${form.address}${form.apartment ? ", " + form.apartment : ""}, ${form.city}, ${form.state} - ${form.pincode}, India`;

    try {
      const orderRes = await fetch(`${BACKEND_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            category: i.category,
          })),
          customerName: fullCustomerName,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: fullAddressString,
          firstName: form.firstName,
          lastName: form.lastName,
          apartment: form.apartment,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          sendCatalog: form.sendCatalog,
          shippingFee: 0, // Discussed and confirmed by shop owner later
          paymentMethod: "RAZORPAY",
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        setErrorMsg(err.message || "Failed to create order on server. Please try again.");
        setStatus("failed");
        return;
      }

      const orderData = await orderRes.json();

      // Live / Test Mode with Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setErrorMsg("Failed to load Razorpay payment gateway script. Please check your network connection.");
        setStatus("idle");
        return;
      }

      const rzpKey = orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!rzpKey || rzpKey === "mock_key") {
        setErrorMsg("Online payment gateway is being connected. Please contact sanskritisareeemail@gmail.com for assisted checkout.");
        setStatus("idle");
        return;
      }

      const rzp = new window.Razorpay({
        key: rzpKey,
        amount: orderData.amount || finalPayableAmount * 100,
        currency: orderData.currency || "INR",
        name: "Sanskriti Sarees Mill",
        description: `Order ${orderData.orderNumber} (${totalItems} items)`,
        order_id: orderData.orderId,
        prefill: {
          name: fullCustomerName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#8B0000" },
        handler: async (response: RazorpayPaymentResponse) => {
          await verifyAndFinish(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            orderData.orderNumber,
            finalPayableAmount
          );
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to connect to order server. Please check your network or try again later.");
      setStatus("failed");
    }
  };

  // SUCCESS / CONFIRMATION PAGE
  if (status === "success" && orderReceipt) {
    return (
      <div className="min-h-[75vh] bg-surface flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-500/30">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
              Payment Confirmed &amp; Order Placed
            </span>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface mt-1">
              Order #{orderReceipt.orderNumber}
            </h1>
            <p className="text-xs text-on-surface-variant mt-2">
              Confirmation sent to <strong className="text-on-surface">{orderReceipt.customerEmail}</strong>
            </p>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 text-left space-y-3">
            <div className="flex justify-between text-xs text-on-surface-variant border-b border-outline-variant/20 pb-2">
              <span>Payment ID:</span>
              <span className="font-mono text-on-surface font-semibold">{orderReceipt.paymentId}</span>
            </div>
            <div className="flex justify-between text-xs text-on-surface font-bold border-b border-outline-variant/20 pb-2">
              <span>Amount Paid:</span>
              <span className="text-primary text-sm">₹{orderReceipt.totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="bg-amber-500/10 border border-amber-600/30 p-3 rounded-lg text-xs text-gray-800 space-y-1">
              <p className="font-semibold text-amber-900">Delivery Information (Customer Paid):</p>
              <p className="text-[11px] leading-relaxed">
                The exact delivery/courier charge will be confirmed with you directly by the shop owner prior to parcel dispatch, based on destination and package weight.
              </p>
            </div>
            {form.sendCatalog && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <span className="material-symbols-outlined text-base">mark_email_read</span>
                <span>Confirmed: You will receive our latest saree catalog on WhatsApp &amp; Email.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-primary text-on-primary text-xs font-label-md uppercase tracking-widest hover:bg-tertiary-container transition-all shadow-md rounded-xs"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="px-6 py-3.5 border border-outline-variant text-on-surface text-xs font-label-md uppercase tracking-widest hover:bg-surface-container transition-all rounded-xs"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART FALLBACK
  if (items.length === 0 && status !== "processing") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
        <div className="space-y-4 max-w-sm">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">shopping_bag</span>
          <h2 className="text-xl font-headline-md text-on-surface">Your Cart is Empty</h2>
          <p className="text-xs text-on-surface-variant">Add curated sarees to your cart before proceeding to billing.</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-primary text-on-primary text-xs uppercase tracking-widest font-label-md">
            Explore Sarees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 text-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column — Form Fields */}
        <form onSubmit={handlePayNow} className="lg:col-span-7 space-y-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs">
          
          {/* Disclaimer Banner */}
          <div className="bg-amber-500/10 border border-amber-600/30 rounded-xl p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined text-amber-800 text-xl">info</span>
            <div>
              <h4 className="text-gray-900 font-bold text-sm">Unstitched Sarees Notice</h4>
              <p className="text-gray-700 text-xs mt-1 leading-relaxed">
                All sarees are delivered unstitched as complete traditional drapes. We do not provide stitching, fall, or picot services.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Customer Contact</h2>
            <div className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email Address (for order confirmation) *"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />
              <input
                type="tel"
                required
                placeholder="Mobile / WhatsApp Number (for delivery coordination) *"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />
            </div>

            {/* Checkbox for Catalog Confirmation */}
            <label className="flex items-start gap-3 p-3.5 bg-rose-50/40 border border-rose-200/70 rounded-xl cursor-pointer hover:bg-rose-50/60 transition-colors">
              <input
                type="checkbox"
                checked={form.sendCatalog}
                onChange={(e) => set("sendCatalog", e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-rose-800 focus:ring-rose-800 h-4 w-4"
              />
              <div className="text-xs text-gray-700">
                <span className="font-semibold text-gray-900 block">
                  Send me the latest saree catalog &amp; new collection releases
                </span>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  Confirm to receive digital saree catalogs and festive offers directly via WhatsApp and Email.
                </span>
              </div>
            </label>
          </div>

          {/* Delivery Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Delivery Address (India Only)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name (optional)"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />
              <input
                type="text"
                required
                placeholder="Last Name *"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />
            </div>

            <input
              type="text"
              required
              placeholder="Street Address, House / Flat No. *"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
            />

            <input
              type="text"
              placeholder="Apartment, suite, landmark (optional)"
              value={form.apartment}
              onChange={(e) => set("apartment", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="City *"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />
              <select
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-xs focus:outline-none focus:border-rose-800"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="PIN Code *"
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />
            </div>
          </div>

          {/* Shipping Method Section (Customer-Paid, Confirmed Later by Owner) */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Shipping &amp; Delivery (Customer Paid)</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold block text-gray-900">Standard Domestic Courier Delivery</span>
                <span className="text-gray-500 text-[11px] block mt-0.5">
                  Delivery charges are paid 100% by the customer. The exact delivery fee is confirmed with you directly by the shop owner prior to dispatch.
                </span>
              </div>
              <span className="font-bold text-rose-900 text-xs shrink-0 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                Confirmed by Owner Later
              </span>
            </div>
          </div>

          {/* Payment Section - Strictly 100% Prepaid Online Orders */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Payment (100% Prepaid Online Only)</h2>
              <p className="text-xs text-gray-500">All orders are strictly prepaid prior to dispatch. Cash on Delivery (COD) is not accepted.</p>
            </div>

            {/* Razorpay Option */}
            <div className="border-2 border-rose-800 bg-rose-50/20 rounded-xl p-4 cursor-default">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={true}
                    readOnly
                    className="text-rose-800 focus:ring-rose-800"
                  />
                  <span className="text-xs font-bold text-gray-900">
                    Razorpay Secure (UPI, Debit/Credit Cards, Net Banking)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">UPI</span>
                  <span className="text-[9px] bg-blue-800 text-white font-bold px-1.5 py-0.5 rounded">Cards</span>
                  <span className="text-[9px] bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded">NetBanking</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                Pay securely using Razorpay gateway. We accept all major UPI apps (GPay, PhonePe, Paytm), Debit/Credit Cards, and Net Banking. Instant order confirmation with zero convenience fees.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Pay Button */}
          <button
            type="submit"
            disabled={status === "processing"}
            className="w-full py-4 bg-[#8B1E24] hover:bg-[#72181D] text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {status === "processing" ? (
              <span>Processing Order &amp; Payment...</span>
            ) : (
              <span>Confirm &amp; Pay — ₹{finalPayableAmount.toLocaleString("en-IN")}</span>
            )}
          </button>

          {/* Footer Policy Links for Checkout Compliance */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-[11px] text-gray-500 justify-center">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/shipping-policy" className="hover:underline">Shipping Policy</Link>
            <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
          </div>
        </form>

        {/* Right Column — Summary */}
        <aside className="lg:col-span-5">
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl sticky top-28 space-y-6">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-3">
              Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200">
                  <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900 shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Product Subtotal</span>
                <span className="font-semibold text-gray-900">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Delivery Charge (Customer Paid)</span>
                <span className="font-medium text-amber-800 text-[11px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Confirmed by owner later
                </span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Applicable Taxes</span>
                <span>Included in product prices</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total Payable Now</span>
                <span className="text-rose-900">₹{finalPayableAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-600/30 rounded-xl p-3 text-[11px] text-gray-700 leading-relaxed">
              <strong className="text-amber-950 block mb-1">Customer Delivery Note:</strong>
              Delivery charges are paid 100% by the customer. The exact delivery fee is communicated directly by the shop owner prior to parcel dispatch based on courier rates.
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3 text-[11px] text-gray-600 space-y-1">
              <p><strong>Shop:</strong> Sanskriti Sarees Mill</p>
              <p><strong>Dispatch:</strong> Shahdara, Delhi - 110093</p>
              <p><strong>Email:</strong> sanskritisareeemail@gmail.com</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
