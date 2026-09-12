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
  orderStatus: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentMethod?: "RAZORPAY" | "COD";
  items: OrderItem[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
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
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
          setSelectedOrder((prev) => prev ? { ...prev, orderStatus: newStatus as any } : null);
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

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "ALL" || o.orderStatus === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (o.orderNumber && o.orderNumber.toLowerCase().includes(searchLower)) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchLower)) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(searchLower)) ||
      (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(searchLower));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-amber-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">local_shipping</span>
            Customer Orders & Billing Tracking
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Track customer payments via Razorpay / COD, view delivery addresses, and update fulfillment tracking status.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-amber-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh Orders
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-3 text-neutral-500 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Email, or Payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "PLACED", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
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

      {/* Orders Table / Cards */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400 animate-pulse">
          Loading customer orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400">
          No orders found matching your filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPaid = order.status === "paid";
            return (
              <div
                key={order._id}
                className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 md:p-6 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-300 text-base">
                      {order.orderNumber || `SAN-${order._id.substring(0, 6)}`}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full border ${
                        isPaid
                          ? "bg-emerald-950 border-emerald-500/50 text-emerald-300"
                          : "bg-amber-950 border-amber-500/50 text-amber-300"
                      }`}
                    >
                      {isPaid ? "Payment Paid" : "Payment Pending"}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-neutral-100 block">
                      ₹{(order.amount / 100).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                      Method: {order.paymentMethod || "Razorpay"}
                    </span>
                  </div>
                </div>

                {/* Customer & Shipping Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-300">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                      Customer Contact
                    </span>
                    <p className="font-medium text-neutral-100">{order.customerName || "Customer"}</p>
                    <p className="text-neutral-400">{order.customerEmail || "N/A"}</p>
                    <p className="text-neutral-400">{order.customerPhone || "N/A"}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                      Shipping Address
                    </span>
                    <p className="text-neutral-300 leading-relaxed truncate-2-lines" title={order.shippingAddress}>
                      {order.shippingAddress || "Standard Address"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                      Payment Verification Reference
                    </span>
                    <p className="font-mono text-neutral-300 text-[11px]">
                      {order.razorpayPaymentId ? (
                        <span className="text-emerald-400">{order.razorpayPaymentId}</span>
                      ) : (
                        <span className="text-neutral-500">{order.razorpayOrderId}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3 flex flex-wrap items-center gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-7 h-7 object-cover rounded" />
                      )}
                      <span className="text-xs text-neutral-200">{item.name}</span>
                      <span className="text-[10px] font-semibold text-amber-400">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Status Stepper & Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-neutral-400 mr-2">Order Tracking:</span>
                    {["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => {
                      const isActive = order.orderStatus === st;
                      return (
                        <button
                          key={st}
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusChange(order._id, st)}
                          className={`px-3 py-1 text-[11px] rounded-md font-semibold transition-all border ${
                            isActive
                              ? "bg-amber-600 text-white border-amber-500 shadow-md"
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
                    className="px-4 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-lg font-medium border border-amber-500/20 transition-all text-center"
                  >
                    View Full Receipt & Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest block">Customer Order Receipt</span>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  {selectedOrder.orderNumber || `SAN-${selectedOrder._id}`}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Items Ordered</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg" />}
                      <div>
                        <p className="text-xs font-semibold text-neutral-100">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-400">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div>
                <span className="text-neutral-500 uppercase text-[10px] font-bold block mb-1">Customer & Address</span>
                <p className="text-neutral-200 font-semibold">{selectedOrder.customerName}</p>
                <p className="text-neutral-400">{selectedOrder.customerEmail}</p>
                <p className="text-neutral-400">{selectedOrder.customerPhone}</p>
                <p className="text-neutral-300 mt-2">{selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <span className="text-neutral-500 uppercase text-[10px] font-bold block mb-1">Payment & Tracking</span>
                <p className="text-neutral-300">Method: <strong className="text-neutral-100">{selectedOrder.paymentMethod || "RAZORPAY"}</strong></p>
                <p className="text-neutral-300">Status: <strong className="text-emerald-400">{selectedOrder.status.toUpperCase()}</strong></p>
                <p className="text-neutral-300 mt-2">Razorpay Order ID: <br/><code className="text-[11px] text-amber-300">{selectedOrder.razorpayOrderId}</code></p>
                <p className="text-neutral-300">Payment ID: <br/><code className="text-[11px] text-emerald-300">{selectedOrder.razorpayPaymentId || "N/A"}</code></p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-neutral-800 pt-4">
              <span className="text-sm text-neutral-400">Total Order Amount</span>
              <span className="text-2xl font-bold text-amber-300">
                ₹{(selectedOrder.amount / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
