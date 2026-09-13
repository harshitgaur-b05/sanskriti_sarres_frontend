"use client";

import React, { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface CustomerOrder {
  _id: string;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  orderStatus: "PLACED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod?: "RAZORPAY" | "COD";
  items: OrderItem[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt: string;
}

interface Props {
  orders: CustomerOrder[];
  loading: boolean;
  onRefresh: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function OrdersTab({ orders, loading, onRefresh, showToast }: Props) {
  // Main View Mode: "ALL" | "PAID" | "LEADS"
  const [viewTab, setViewTab] = useState<"ALL" | "PAID" | "LEADS">("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Compute Metrics
  const paidOrders = orders.filter((o) => o.status === "paid");
  const leadOrders = orders.filter((o) => o.status !== "paid");

  const totalRevenue = paidOrders.reduce((acc, o) => acc + (o.amount || 0), 0) / 100;
  const leadValue = leadOrders.reduce((acc, o) => acc + (o.amount || 0), 0) / 100;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        showToast(`Order status updated to ${newStatus}`);
        onRefresh();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus as any } : null));
        }
      } else {
        showToast("Failed to update order status", "error");
      }
    } catch {
      showToast("Server error updating status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtering Logic
  const filteredOrders = orders.filter((o) => {
    // View Tab Filter
    if (viewTab === "PAID" && o.status !== "paid") return false;
    if (viewTab === "LEADS" && o.status === "paid") return false;

    // Fulfillment Filter
    if (filterStatus !== "ALL" && o.orderStatus !== filterStatus) return false;

    // Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const name = (o.customerName || `${o.firstName || ""} ${o.lastName || ""}`).toLowerCase();
      const email = (o.customerEmail || "").toLowerCase();
      const phone = (o.customerPhone || "").toLowerCase();
      const orderNo = (o.orderNumber || "").toLowerCase();
      const rzpPayId = (o.razorpayPaymentId || "").toLowerCase();
      const rzpOrderId = (o.razorpayOrderId || "").toLowerCase();
      const city = (o.city || "").toLowerCase();

      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        orderNo.includes(q) ||
        rzpPayId.includes(q) ||
        rzpOrderId.includes(q) ||
        city.includes(q)
      );
    }

    return true;
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-amber-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">group</span>
            Customer Directory & Order Tracking
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            View customer contact details, manage leads from checkout attempts, and fulfill confirmed Razorpay orders.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-amber-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh Orders & Leads
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-5">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Total Revenue
          </span>
          <span className="text-xl md:text-2xl font-bold text-emerald-400">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-neutral-500 block mt-1">From confirmed payments</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-5">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Confirmed Orders
          </span>
          <span className="text-xl md:text-2xl font-bold text-amber-300">{paidOrders.length}</span>
          <span className="text-[10px] text-neutral-500 block mt-1">Ready for fulfillment</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-5">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Leads Generated
          </span>
          <span className="text-xl md:text-2xl font-bold text-amber-500">{leadOrders.length}</span>
          <span className="text-[10px] text-neutral-500 block mt-1">Checkout attempts / unpaid</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-5">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Potential Lead Value
          </span>
          <span className="text-xl md:text-2xl font-bold text-neutral-200">
            ₹{leadValue.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-neutral-500 block mt-1">Unconverted opportunities</span>
        </div>
      </div>

      {/* Main View Switcher (Tabs) */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setViewTab("ALL")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewTab === "ALL"
              ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          <span className="material-symbols-outlined text-sm">view_list</span>
          All Records ({orders.length})
        </button>

        <button
          onClick={() => setViewTab("PAID")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewTab === "PAID"
              ? "bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/20"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          <span className="material-symbols-outlined text-sm">verified</span>
          Confirmed Payments ({paidOrders.length})
        </button>

        <button
          onClick={() => setViewTab("LEADS")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewTab === "LEADS"
              ? "bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          <span className="material-symbols-outlined text-sm">person_search</span>
          Leads Generated ({leadOrders.length})
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-neutral-500 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search customer name, phone, email, order #, city, or payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Fulfillment Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all ${
                filterStatus === st
                  ? "bg-amber-500/20 border-amber-500 text-amber-300"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Customer / Order Cards List */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400 animate-pulse">
          Loading customer records and orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400 space-y-2">
          <span className="material-symbols-outlined text-4xl text-neutral-600">inbox</span>
          <p className="text-sm text-neutral-300">No records found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPaid = order.status === "paid";
            const customerDisplayName =
              order.customerName ||
              `${order.firstName || ""} ${order.lastName || ""}`.trim() ||
              "Valued Customer";

            return (
              <div
                key={order._id}
                className={`bg-neutral-900 border rounded-2xl p-5 md:p-6 transition-all space-y-4 ${
                  isPaid
                    ? "border-neutral-800 hover:border-emerald-500/40"
                    : "border-amber-500/30 hover:border-amber-500/60 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/20"
                }`}
              >
                {/* Top Banner Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-bold text-amber-300 text-base">
                      {order.orderNumber || `SAN-${order._id.substring(0, 6)}`}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-0.5 text-[10px] uppercase font-bold rounded-full border flex items-center gap-1 ${
                        isPaid
                          ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300"
                          : "bg-amber-950/80 border-amber-500/60 text-amber-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {isPaid ? "verified" : "pending"}
                      </span>
                      {isPaid ? "Confirmed Payment" : "Lead Generated (Unpaid)"}
                    </span>

                    <span className="text-[11px] text-neutral-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-lg font-bold text-neutral-100 block">
                      ₹{((order.amount || 0) / 100).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                      Method: {order.paymentMethod || "RAZORPAY"}
                    </span>
                  </div>
                </div>

                {/* Customer Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-300">
                  {/* Column 1: Customer Contact Info */}
                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider block mb-1">
                      👤 Customer Contact
                    </span>
                    <p className="font-semibold text-neutral-100 text-sm">{customerDisplayName}</p>

                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="material-symbols-outlined text-xs text-neutral-400">mail</span>
                      <span>{order.customerEmail || "No Email Provided"}</span>
                      {order.customerEmail && (
                        <button
                          onClick={() => copyToClipboard(order.customerEmail!, "Email")}
                          className="text-neutral-500 hover:text-amber-300 text-[10px]"
                          title="Copy Email"
                        >
                          content_copy
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="material-symbols-outlined text-xs text-neutral-400">call</span>
                      <span className="font-mono">{order.customerPhone || "No Phone Provided"}</span>
                      {order.customerPhone && (
                        <button
                          onClick={() => copyToClipboard(order.customerPhone!, "Phone Number")}
                          className="text-neutral-500 hover:text-amber-300 text-[10px]"
                          title="Copy Phone"
                        >
                          content_copy
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Delivery & Shipping Address */}
                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider block mb-1">
                      📍 Delivery Address
                    </span>
                    <p className="text-neutral-200 leading-relaxed font-medium">
                      {order.shippingAddress || "Address Not Recorded"}
                    </p>
                    {(order.city || order.state || order.pincode) && (
                      <p className="text-neutral-400 text-[11px]">
                        {[order.city, order.state, order.pincode].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Column 3: Payment Verification & Quick Lead Followup */}
                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800/80 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider block mb-1">
                        💳 Payment Verification
                      </span>
                      <p className="font-mono text-neutral-300 text-[11px]">
                        Razorpay Order ID: <br />
                        <code className="text-amber-300 text-[11px]">{order.razorpayOrderId}</code>
                      </p>
                      {order.razorpayPaymentId && (
                        <p className="font-mono text-neutral-300 text-[11px] mt-1">
                          Payment ID: <br />
                          <code className="text-emerald-400 text-[11px]">{order.razorpayPaymentId}</code>
                        </p>
                      )}
                    </div>

                    {/* Quick Lead Contact Action */}
                    {!isPaid && order.customerPhone && (
                      <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${order.customerPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                            customerDisplayName
                          )},%20we%20noticed%20you%20tried%20placing%20an%20order%20for%20Sanskriti%20Sarees.%20Can%20we%20help%20you%20complete%20your%20purchase?`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">chat</span>
                          WhatsApp Lead
                        </a>
                        {order.customerEmail && (
                          <a
                            href={`mailto:${order.customerEmail}?subject=Your%20Sanskriti%20Sarees%20Order%20${order.orderNumber}`}
                            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">mail</span>
                            Email Lead
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Ordered Preview */}
                <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3 flex flex-wrap items-center gap-3">
                  <span className="text-[11px] text-neutral-400 font-semibold mr-1">Items ({order.items.length}):</span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-7 h-7 object-cover rounded" />
                      )}
                      <span className="text-xs text-neutral-200 font-medium">{item.name}</span>
                      <span className="text-[10px] font-bold text-amber-400">×{item.quantity}</span>
                      <span className="text-[11px] text-neutral-400">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Stepper & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs text-neutral-400 mr-2">Fulfillment:</span>
                    {["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => {
                      const isActive = order.orderStatus === st;
                      return (
                        <button
                          key={st}
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusChange(order._id, st)}
                          className={`px-3 py-1 text-[11px] rounded-md font-semibold transition-all border ${
                            isActive
                              ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md font-bold"
                              : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-lg font-medium border border-amber-500/20 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">receipt_long</span>
                    Full Order Details & Receipt
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest block">
                  {selectedOrder.status === "paid" ? "Confirmed Customer Order Receipt" : "Generated Lead Record"}
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  {selectedOrder.orderNumber || `SAN-${selectedOrder._id}`}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Items Ordered Table */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Items Selected
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg" />}
                      <div>
                        <p className="text-xs font-semibold text-neutral-100">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-400">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div>
                <span className="text-neutral-500 uppercase text-[10px] font-bold block mb-1">
                  Customer & Contact Information
                </span>
                <p className="text-neutral-100 font-bold text-sm">
                  {selectedOrder.customerName || `${selectedOrder.firstName || ""} ${selectedOrder.lastName || ""}`.trim() || "N/A"}
                </p>
                <p className="text-neutral-300 mt-1">Email: <span className="text-neutral-100 font-mono">{selectedOrder.customerEmail || "N/A"}</span></p>
                <p className="text-neutral-300">Phone: <span className="text-amber-300 font-mono">{selectedOrder.customerPhone || "N/A"}</span></p>
                <p className="text-neutral-400 mt-2 font-medium">Shipping Address:</p>
                <p className="text-neutral-200 leading-relaxed">{selectedOrder.shippingAddress || "N/A"}</p>
              </div>

              <div>
                <span className="text-neutral-500 uppercase text-[10px] font-bold block mb-1">
                  Payment & Verification Metadata
                </span>
                <p className="text-neutral-300">Payment Status: <strong className={selectedOrder.status === "paid" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{selectedOrder.status.toUpperCase()}</strong></p>
                <p className="text-neutral-300">Fulfillment Status: <strong className="text-amber-300">{selectedOrder.orderStatus}</strong></p>
                <p className="text-neutral-300 mt-1">Method: <strong className="text-neutral-100">{selectedOrder.paymentMethod || "RAZORPAY"}</strong></p>
                <p className="text-neutral-300 mt-2">Razorpay Order ID: <br /><code className="text-[11px] text-amber-300">{selectedOrder.razorpayOrderId}</code></p>
                <p className="text-neutral-300">Razorpay Payment ID: <br /><code className="text-[11px] text-emerald-300">{selectedOrder.razorpayPaymentId || "N/A"}</code></p>
              </div>
            </div>

            {/* Total Footer */}
            <div className="flex justify-between items-center border-t border-neutral-800 pt-4">
              <span className="text-sm text-neutral-400">Total Order Amount</span>
              <span className="text-2xl font-bold text-amber-300">
                ₹{((selectedOrder.amount || 0) / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
