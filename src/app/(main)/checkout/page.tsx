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
  "Uttar Pradesh",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
  "Rajasthan",
  "Telangana",
  "Kerala",
  "Punjab",
  "Haryana",
  "Madhya Pradesh",
  "Bihar",
  "Other State / UT",
];

type CheckoutStatus = "idle" | "processing" | "mock_confirm" | "success" | "failed";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();

  const [form, setForm] = useState({
    email: "",
    emailOffers: false,
    country: "India",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "Uttar Pradesh",
    pincode: "",
    phone: "",
    saveInfo: true,
    textOffers: false,
    paymentMethod: "RAZORPAY", // "RAZORPAY" | "COD"
    billingSameAsShipping: true,
  });

  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderReceipt, setOrderReceipt] = useState<{
    orderNumber: string;
    paymentId: string;
    customerEmail: string;
  } | null>(null);
  const [mockOrderData, setMockOrderData] = useState<{ orderId: string; amount: number; orderNumber: string } | null>(null);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  // Verify Payment & redirect to tracking state
  const verifyAndFinish = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderNum: string
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
        });
        setStatus("success");
        clearCart();
      } else {
        setErrorMsg("Payment verification failed. Please contact support with Payment ID: " + razorpayPaymentId);
        setStatus("failed");
      }
    } catch {
      setErrorMsg("Error verifying payment with server.");
      setStatus("failed");
    }
  };

  // Mock payment handler
  const handleMockPay = async () => {
    if (!mockOrderData) return;
    setStatus("processing");
    try {
      const mockPaymentId = `pay_mock_${Date.now().toString().slice(-8)}`;
      await verifyAndFinish(mockOrderData.orderId, mockPaymentId, "mock_signature", mockOrderData.orderNumber);
    } catch {
      setErrorMsg("Mock payment processing error.");
      setStatus("failed");
    }
    setMockOrderData(null);
  };

  // Checkout submission
  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.lastName || !form.address || !form.city || !form.phone) {
      setErrorMsg("Please complete all required fields (Email, Last name, Address, City, Phone).");
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setErrorMsg("");
    setStatus("processing");

    const fullCustomerName = `${form.firstName} ${form.lastName}`.trim();
    const fullAddressString = `${form.address}${form.apartment ? ", " + form.apartment : ""}, ${form.city}, ${form.state} ${form.pincode}, ${form.country}`;

    try {
      // Create backend Order
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
          company: form.company,
          apartment: form.apartment,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          paymentMethod: form.paymentMethod,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        setErrorMsg(err.message || "Failed to create order.");
        setStatus("failed");
        return;
      }

      const orderData = await orderRes.json();

      // COD (Cash on Delivery) Flow
      if (form.paymentMethod === "COD") {
        setOrderReceipt({
          orderNumber: orderData.orderNumber || "SAN-COD",
          paymentId: "Cash On Delivery (Pending)",
          customerEmail: form.email,
        });
        setStatus("success");
        clearCart();
        return;
      }

      // MOCK MODE — Show test dialog if keys aren't set
      if (orderData.mock) {
        setMockOrderData({
          orderId: orderData.orderId,
          amount: orderData.amount,
          orderNumber: orderData.orderNumber,
        });
        setStatus("mock_confirm");
        return;
      }

      // LIVE MODE — Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setErrorMsg("Failed to load Razorpay payment gateway.");
        setStatus("idle");
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
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
            orderData.orderNumber
          );
        },
        modal: { ondismiss: () => setStatus("idle") },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error during checkout initialization.");
      setStatus("failed");
    }
  };

  // SUCCESS / ORDER TRACKED PAGE
  if (status === "success" && orderReceipt) {
    return (
      <div className="min-h-[75vh] bg-surface flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
            <span className="material-symbols-outlined text-4xl">verified</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest block">
              Payment Confirmed & Order Placed
            </span>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface mt-1">
              Order #{orderReceipt.orderNumber}
            </h1>
            <p className="text-xs text-on-surface-variant mt-2">
              Confirmation sent to <strong className="text-on-surface">{orderReceipt.customerEmail}</strong>
            </p>
          </div>

          {/* Real-time Order Tracking Stepper */}
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 text-left space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface block">
              Live Order Fulfillment Status
            </span>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wider font-semibold">
              <div className="text-emerald-700 flex flex-col items-center gap-1">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
                Order Placed
              </div>
              <div className="text-amber-700 flex flex-col items-center gap-1">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">2</span>
                Weaving Prep
              </div>
              <div className="text-on-surface-variant/40 flex flex-col items-center gap-1">
                <span className="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs">3</span>
                Dispatched
              </div>
              <div className="text-on-surface-variant/40 flex flex-col items-center gap-1">
                <span className="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs">4</span>
                Delivered
              </div>
            </div>

            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-1/4 rounded-full" />
            </div>

            <div className="text-xs text-on-surface-variant flex justify-between pt-2 border-t border-outline-variant/20">
              <span>Payment ID: <strong className="font-mono text-on-surface">{orderReceipt.paymentId}</strong></span>
              <span>Estimated Delivery: <strong>3-5 Days</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-primary text-on-primary text-xs font-label-md uppercase tracking-widest hover:bg-tertiary-container transition-all shadow-md rounded-xs"
            >
              Continue Drapes Catalog
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
  if (items.length === 0 && status !== "processing" && status !== "mock_confirm") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
        <div className="space-y-4 max-w-sm">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">shopping_bag</span>
          <h2 className="text-xl font-headline-md text-on-surface">Your Bag is Empty</h2>
          <p className="text-xs text-on-surface-variant">Add handloom saree heirlooms to your cart before proceeding to billing.</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-primary text-on-primary text-xs uppercase tracking-widest font-label-md">
            Explore Handlooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mock payment modal */}
      {status === "mock_confirm" && mockOrderData && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-[#5C1A1A] px-6 py-5 text-white">
              <span className="text-xs uppercase font-semibold text-amber-300 tracking-widest block">Razorpay Test Gateway</span>
              <h3 className="text-2xl font-bold mt-1">₹{(mockOrderData.amount / 100).toLocaleString("en-IN")}</h3>
              <p className="text-xs text-white/70 mt-1">Order #{mockOrderData.orderNumber}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 leading-relaxed">
                <strong>Razorpay Simulation Mode:</strong> You can test order completion now. Once real keys are added to <code>.env</code>, live Razorpay popups will handle card/UPI payments automatically.
              </div>
              <button
                onClick={handleMockPay}
                className="w-full py-3.5 bg-[#5C1A1A] hover:bg-[#4A1515] text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-colors shadow-md"
              >
                Complete Test Payment
              </button>
              <button
                onClick={() => setStatus("idle")}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing & Delivery Page */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 text-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column — Form Fields matching user screenshot */}
          <form onSubmit={handlePayNow} className="lg:col-span-7 space-y-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs">
            
            {/* Contact Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Contact</h2>
                <Link href="/admin" className="text-xs text-rose-800 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
                />
              </div>
              <label className="flex items-center gap-2 mt-3 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.emailOffers}
                  onChange={(e) => set("emailOffers", e.target.checked)}
                  className="rounded border-gray-300 text-rose-800 focus:ring-rose-800"
                />
                Email me with news and offers
              </label>
            </div>

            {/* Delivery Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Delivery</h2>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Country/Region</label>
                <select
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
                />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
                />
              </div>

              <input
                type="text"
                placeholder="Company (optional)"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />

              <input
                type="text"
                required
                placeholder="Address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />

              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={form.apartment}
                onChange={(e) => set("apartment", e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="City"
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
                  placeholder="PIN code"
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
                />
              </div>

              <input
                type="tel"
                required
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-800"
              />

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.saveInfo}
                    onChange={(e) => set("saveInfo", e.target.checked)}
                    className="rounded border-gray-300 text-rose-800 focus:ring-rose-800"
                  />
                  Save this information for next time
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.textOffers}
                    onChange={(e) => set("textOffers", e.target.checked)}
                    className="rounded border-gray-300 text-rose-800 focus:ring-rose-800"
                  />
                  Text me with news and offers
                </label>
              </div>
            </div>

            {/* Shipping Method Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Shipping method</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 flex justify-between items-center">
                <span>Insured Express Handloom Delivery (2-4 Business Days)</span>
                <span className="font-bold text-emerald-700 uppercase">FREE</span>
              </div>
            </div>

            {/* Payment Section (Matching user screenshot) */}
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Payment</h2>
                <p className="text-xs text-gray-500">All transactions are secure and encrypted.</p>
              </div>

              {/* Razorpay Option */}
              <div
                onClick={() => set("paymentMethod", "RAZORPAY")}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  form.paymentMethod === "RAZORPAY"
                    ? "border-rose-800 bg-rose-50/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === "RAZORPAY"}
                      onChange={() => set("paymentMethod", "RAZORPAY")}
                      className="text-rose-800 focus:ring-rose-800"
                    />
                    <span className="text-xs font-bold text-gray-900">
                      Razorpay Secure (UPI, Card, Int'l Card, Apple Pay)
                    </span>
                  </div>
                  {/* Payment Badges */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">UPI</span>
                    <span className="text-[9px] bg-blue-800 text-white font-bold px-1.5 py-0.5 rounded">VISA</span>
                    <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">MC</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 pl-6 leading-relaxed">
                  You'll be redirected to Razorpay Secure (UPI, Card, NetBanking, Apple Pay) to complete your purchase.
                </p>
              </div>

              {/* Cash On Delivery Option */}
              <div
                onClick={() => set("paymentMethod", "COD")}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  form.paymentMethod === "COD"
                    ? "border-rose-800 bg-rose-50/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={form.paymentMethod === "COD"}
                    onChange={() => set("paymentMethod", "COD")}
                    className="text-rose-800 focus:ring-rose-800"
                  />
                  <span className="text-xs font-bold text-gray-900">
                    Cash on Delivery (COD) / Pay on Arrival
                  </span>
                </div>
                <p className="text-xs text-gray-500 pl-6 mt-1">
                  Pay via Cash or UPI directly to courier delivery executive.
                </p>
              </div>
            </div>

            {/* Billing Address Option */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">Billing address</h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <label className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-200 ${form.billingSameAsShipping ? "bg-rose-50/20 font-semibold text-rose-900" : ""}`}>
                  <input
                    type="radio"
                    name="billing"
                    checked={form.billingSameAsShipping}
                    onChange={() => set("billingSameAsShipping", true)}
                    className="text-rose-800"
                  />
                  Same as shipping address
                </label>
                <label className={`flex items-center gap-3 p-4 cursor-pointer ${!form.billingSameAsShipping ? "bg-rose-50/20 font-semibold text-rose-900" : ""}`}>
                  <input
                    type="radio"
                    name="billing"
                    checked={!form.billingSameAsShipping}
                    onChange={() => set("billingSameAsShipping", false)}
                    className="text-rose-800"
                  />
                  Use a different billing address
                </label>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Primary Pay Now Button matching user screenshot */}
            <button
              type="submit"
              disabled={status === "processing"}
              className="w-full py-4 bg-[#8B1E24] hover:bg-[#72181D] text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {status === "processing" ? (
                <span>Processing Order & Payment...</span>
              ) : (
                <span>Pay now — ₹{totalPrice.toLocaleString("en-IN")}</span>
              )}
            </button>
          </form>

          {/* Right Column — Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl sticky top-28 space-y-6">
              <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-3">
                Order Summary ({totalItems} items)
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
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-rose-900">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
