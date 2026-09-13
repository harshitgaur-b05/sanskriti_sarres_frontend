"use client";

export type AdminTab = "all-products" | "add-product" | "hero" | "blogs" | "orders";

interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onSeedProducts: () => void;
  productCount: number;
  orderCount?: number;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  onSeedProducts,
  productCount,
  orderCount = 0,
}: Props) {
  const navItem = (tab: AdminTab, icon: React.ReactNode, label: string, badge?: number) => (
    <button
      onClick={() => onTabChange(tab)}
      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
        activeTab === tab
          ? "bg-gradient-to-r from-amber-950/80 to-amber-900/40 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-950/50"
          : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {badge !== undefined && (
        <span className="text-xs bg-amber-950 text-amber-400 px-2 py-0.5 rounded-full border border-amber-800/40">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <aside className="w-full md:w-72 bg-neutral-900/90 border-r border-amber-900/20 p-6 flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-8">
          <img src="/logo.png" alt="Sanskriti Sarees Mill Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-lg font-serif font-bold text-amber-200 tracking-wide">
              Sanskriti Sarees
            </h1>
            <p className="text-xs text-neutral-400">Admin Control Center</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItem(
            "orders",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>,
            "Customer Orders",
            orderCount
          )}
          {navItem(
            "all-products",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>,
            "All Products",
            productCount
          )}
          {navItem(
            "add-product",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
            </svg>,
            "Add New Saree"
          )}
          {navItem(
            "hero",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>,
            "Hero Banner Image"
          )}
          {navItem(
            "blogs",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6" />
            </svg>,
            "Blog Posts"
          )}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-neutral-800 mt-6 space-y-3">
        <button
          onClick={onSeedProducts}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-xl text-xs font-semibold tracking-wider uppercase shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Post 10 Sample Sarees
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2 px-4 bg-neutral-800 hover:bg-rose-950 text-neutral-300 hover:text-rose-200 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 border border-neutral-700/50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout Securely
        </button>
      </div>
    </aside>
  );
}
