"use client";

import React, { useCallback, useEffect, useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import ProductsTab, { Product } from "@/components/admin/AdminTabs/ProductsTab";
import AddProductTab from "@/components/admin/AdminTabs/AddProductTab";
import HeroTab from "@/components/admin/AdminTabs/HeroTab";
import BlogTab, { Blog } from "@/components/admin/AdminTabs/BlogTab";
import OrdersTab, { CustomerOrder } from "@/components/admin/AdminTabs/OrdersTab";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Toast = { message: string; type: "success" | "error" };

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [heroImage, setHeroImage] = useState("");
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroSlides, setHeroSlides] = useState<{ imageUrl: string; targetUrl: string }[]>([]);
  const [heroInterval, setHeroInterval] = useState(4000);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Auth ─────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem("sanskriti_admin_auth") === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    if (
      (email.trim() === "admin@sanskriti.com" || email.trim() === "admin") &&
      password === "admin123"
    ) {
      localStorage.setItem("sanskriti_admin_auth", "authenticated");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Use admin@sanskriti.com / admin123");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sanskriti_admin_auth");
    setIsAuthenticated(false);
    showToast("Logged out successfully.");
  };

  // ── Data Fetching ─────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchHero = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/hero`);
      if (res.ok) {
        const data = await res.json();
        setHeroImage(data.imageUrl || "");
        if (Array.isArray(data.slides)) {
          setHeroSlides(data.slides);
        }
        if (Array.isArray(data.images)) {
          setHeroImages(data.images);
        } else if (Array.isArray(data.imageUrls)) {
          setHeroImages(data.imageUrls);
        }
        if (typeof data.interval === "number") {
          setHeroInterval(data.interval);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/blogs`);
      if (res.ok) setBlogs(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "sanskriti-admin-2024" },
      });
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Fetch orders immediately on mount (no auth required on this endpoint)
  // and again whenever isAuthenticated changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchHero();
      fetchBlogs();
    }
  }, [isAuthenticated, fetchProducts, fetchHero, fetchBlogs]);

  // ── Seed ──────────────────────────────────────────────
  const handleSeedProducts = async () => {
    if (!confirm("This will replace current products with 10 pre-loaded luxury Saree products. Continue?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/seed`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "10 Sarees seeded!");
        fetchProducts();
        setActiveTab("all-products");
      }
    } catch {
      showToast("Failed to seed products", "error");
    }
  };

  // ── Render ────────────────────────────────────────────
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-2xl border text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-950 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950 border-rose-500/50 text-rose-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onSeedProducts={handleSeedProducts}
        productCount={products.length}
        orderCount={orders.length}
      />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            loading={loadingOrders}
            onRefresh={fetchOrders}
            showToast={showToast}
          />
        )}

        {activeTab === "all-products" && (
          <ProductsTab
            products={products}
            loading={loadingProducts}
            onRefresh={fetchProducts}
            onAddProduct={() => setActiveTab("add-product")}
            onSeedProducts={handleSeedProducts}
            showToast={showToast}
          />
        )}

        {activeTab === "add-product" && (
          <AddProductTab
            onSuccess={() => {
              fetchProducts();
              setActiveTab("all-products");
            }}
            showToast={showToast}
          />
        )}

        {activeTab === "hero" && (
          <HeroTab
            initialImageUrl={heroImage}
            initialImages={heroImages}
            initialSlides={heroSlides}
            initialInterval={heroInterval}
            showToast={showToast}
            onRefreshHero={fetchHero}
          />
        )}

        {activeTab === "blogs" && (
          <BlogTab blogs={blogs} onRefresh={fetchBlogs} showToast={showToast} />
        )}
      </main>
    </div>
  );
}
