"use client";

import React, { createContext, useContext, useEffect, useReducer, useState } from "react";

export interface CartItem {
  id: string;           // product _id or id
  name: string;
  price: number;
  image?: string;
  category: string;
  quantity: number;
}

type CartAction =
  | { type: "ADD"; product: Omit<CartItem, "quantity"> }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "HYDRATE":
      return action.items;
    case "ADD": {
      const existing = state.find((i) => i.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "UPDATE_QTY":
      if (action.qty <= 0) return state.filter((i) => i.id !== action.id);
      return state.map((i) =>
        i.id === action.id ? { ...i, quantity: action.qty } : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sanskriti_cart");
      if (stored) dispatch({ type: "HYDRATE", items: JSON.parse(stored) });
    } catch {}
    setHydrated(true);
  }, []);

  // Persist whenever cart changes (after hydration)
  useEffect(() => {
    if (hydrated) localStorage.setItem("sanskriti_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD", product });
    setCartOpen(true);
  };
  const removeFromCart = (id: string) => dispatch({ type: "REMOVE", id });
  const updateQty = (id: string, qty: number) => dispatch({ type: "UPDATE_QTY", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
