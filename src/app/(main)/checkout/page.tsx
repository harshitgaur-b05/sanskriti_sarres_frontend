"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

// Razorpay global (only used in live mode)
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string;
  name: string; description: string; order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (r: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance { open(): void; }
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

type OrderStatus = "idle" | "processing" | "mock_confirm" | "success" | "failed";

// ── Mock Payment Dialog ───────────────────────────────────────────────────────
function MockPaymentDialog({
  amount,
  onPay,
  onCancel,
}: {
  amount: number;
  onPay: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header mimicking Razorpay style */}
        <div className="bg-[#1A237E] px-6 py-5 text-white">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">S</div>
            <span className="font-semibold text-sm">Sanskriti Sarees Mill</span>
          </div>
          <p className="text-2xl font-bold mt-2">₹{(amount / 100).toLocaleString("en-IN")}</p>
          <p className="text-xs text-white/70 mt-0.5">Test / Mock Payment</p>
        </div>

        {/* Warning banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-start gap-2">
          <span className="text-amber-500 text-lg leading-none mt-0.5">⚠</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Test Mode</strong> — Razorpay keys not configured yet.
            This simulates a successful payment so you can verify the full order flow.
            No real money is charged.
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Fake card input for visual confirmation */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number (dummy)</label>
            <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50 font-mono tracking-widest">
              4111 1111 1111 1111
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
              <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50">12/26</div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">CVV</label>
              <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50">•••</div>
            </div>
          </div>

          <button
            onClick={onPay}
            className="w-full py-3 bg-[#1A237E] hover:bg-[#283593] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Simulate Successful Payment
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Checkout Page ────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [status, setStatus] = useState<OrderStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successOrderId, setSuccessOrderId] = useState("");
  const [mockOrderData, setMockOrderData] = useState<{ orderId: string; amount: number } | null>(null);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  // ── Shared verify call ───────────────────────────────────────────────────
  const verifyAndFinish = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) => {
    const verifyRes = await fetch(`${BACKEND_URL}/api/orders/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
    });
    const data = await verifyRes.json();
    if (data.success) {
      setSuccessOrderId(razorpayPaymentId);
      setStatus("success");
      clearCart();
    } else {
      setErrorMsg("Payment verification failed. Payment ID: " + razorpayPaymentId);
      setStatus("failed");
    }
  };

  // ── Mock: user clicked "Simulate Payment" ───────────────────────────────
  const handleMockPay = async () => {
    if (!mockOrderData) return;
    setStatus("processing");
    try {
      const mockPaymentId = `mock_pay_${Date.now()}`;
      await verifyAndFinish(mockOrderData.orderId, mockPaymentId, "mock_signature");
    } catch {
      setErrorMsg("Mock verification error.");
      setStatus("failed");
    }
    setMockOrderData(null);
  };

  const handleMockCancel = () => {
    setMockOrderData(null);
    setStatus("idle");
  };

  // ── Submit form ──────────────────────────────────────────────────────────
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setErrorMsg("Please fill in your name, email, and phone number.");
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setErrorMsg("");
    setStatus("processing");

    try {
      // 1. Create backend order
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
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: form.address,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        setErrorMsg(err.message || "Failed to create order.");
        setStatus("failed");
        return;
      }

      const orderData = await orderRes.json();

      // 2a. MOCK MODE — show simulated dialog
      if (orderData.mock) {
        setMockOrderData({ orderId: orderData.orderId, amount: orderData.amount });
        setStatus("mock_confirm");
        return;
      }

      // 2b. LIVE MODE — load Razorpay SDK and open checkout
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setErrorMsg("Failed to load payment gateway. Please try again.");
        setStatus("idle");
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sanskriti Sarees Mill",
        description: `${totalItems} Saree${totalItems > 1 ? "s" : ""}`,
        order_id: orderData.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#000000" },
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            await verifyAndFinish(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          } catch {
            setErrorMsg("Verification error. Payment ID: " + response.razorpay_payment_id);
            setStatus("failed");
          }
        },
        modal: { ondismiss: () => setStatus("idle") },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not reach the server. Make sure the backend is running.");
      setStatus("failed");
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-margin-mobile py-16">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
          </div>
          <h1 className="font-headline-lg text-2xl text-on-surface">Order Confirmed!</h1>
          <p className="text-sm text-on-surface-variant">
            Thank you for your purchase. Your saree is being prepared with care.
          </p>
          <p className="text-xs text-on-surface-variant bg-surface-container px-4 py-2 rounded-full inline-block">
            Payment ID: <span className="font-mono font-semibold">{successOrderId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="px-6 py-3 bg-primary text-on-primary text-xs font-label-md uppercase tracking-widest hover:bg-tertiary-container transition-colors">
              Continue Shopping
            </Link>
            <Link href="/" className="px-6 py-3 border border-outline-variant text-on-surface text-xs font-label-md uppercase tracking-widest hover:bg-surface-container transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart ───────────────────────────────────────────────────────────
  if (items.length === 0 && status !== "processing" && status !== "mock_confirm") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-margin-mobile py-16 text-center">
        <div className="space-y-4">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">shopping_bag</span>
          <p className="text-on-surface-variant">Your cart is empty.</p>
          <Link href="/products" className="inline-block text-xs uppercase tracking-widest text-primary underline underline-offset-4">
            Browse Sarees
          </Link>
        </div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <>
      {/* Mock payment dialog */}
      {status === "mock_confirm" && mockOrderData && (
        <MockPaymentDialog
          amount={mockOrderData.amount}
          onPay={handleMockPay}
          onCancel={handleMockCancel}
        />
      )}

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-16">
        <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface mb-2">Checkout</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-10">
          {totalItems} {totalItems === 1 ? "piece" : "pieces"} · ₹{totalPrice.toLocaleString("en-IN")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left — form */}
          <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-6">
            <h2 className="font-headline-md text-base text-on-surface border-b border-outline-variant/30 pb-3">
              Delivery Details
            </h2>

            {[
              { label: "Full Name *", key: "name", placeholder: "Priya Sharma", type: "text" },
              { label: "Email Address *", key: "email", placeholder: "priya@example.com", type: "email" },
              { label: "Mobile Number *", key: "phone", placeholder: "+91 98765 43210", type: "tel" },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-sm px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/50"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Shipping Address
              </label>
              <textarea
                rows={3}
                placeholder="House/flat number, street, city, state, pincode..."
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-sm px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none placeholder:text-on-surface-variant/50"
              />
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-sm text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "processing"}
              className="w-full py-4 bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-tertiary-container transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "processing" ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{totalPrice.toLocaleString("en-IN")} via Razorpay
                  <span className="material-symbols-outlined text-sm">lock</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-on-surface-variant text-center">
              Secured by Razorpay · All transactions are encrypted
            </p>
          </form>

          {/* Right — summary */}
          <aside className="lg:col-span-5">
            <div className="bg-surface-container-low rounded-lg p-6 sticky top-28">
              <h2 className="font-headline-md text-base text-on-surface mb-5 border-b border-outline-variant/30 pb-3">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-14 h-16 flex-shrink-0 rounded overflow-hidden bg-surface-container">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=120"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-on-surface line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                        {item.category} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-on-surface flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant/30 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-outline-variant/30">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
