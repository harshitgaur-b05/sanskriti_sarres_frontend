"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeFromCart, updateQty, totalItems, totalPrice } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-surface-container-lowest z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <div>
            <h2 className="font-headline-md text-base text-on-surface">Your Cart</h2>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
              {totalItems} {totalItems === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-lg text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                shopping_bag
              </span>
              <p className="text-sm text-on-surface-variant">Your cart is empty.</p>
              <button
                onClick={() => setCartOpen(false)}
                className="text-xs uppercase tracking-widest text-primary underline underline-offset-4"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-surface-container rounded-lg p-3"
              >
                <div className="w-16 h-20 flex-shrink-0 rounded-md overflow-hidden bg-surface-container-high">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-on-surface line-clamp-1">{item.name}</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
                    {item.category}
                  </p>
                  <p className="text-sm font-semibold text-on-surface">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded border border-outline-variant text-on-surface text-xs flex items-center justify-center hover:bg-surface-container-high transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-xs text-on-surface w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded border border-outline-variant text-on-surface text-xs flex items-center justify-center hover:bg-surface-container-high transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-[10px] text-rose-500 hover:text-rose-700 transition-colors"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Subtotal</span>
              <span className="text-base font-semibold text-on-surface">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant">
              Taxes & shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full text-center py-3.5 bg-primary text-on-primary text-xs font-label-md uppercase tracking-widest hover:bg-tertiary-container transition-colors rounded-sm shadow-md"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
