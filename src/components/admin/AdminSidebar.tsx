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
          <img src="/logo_sanskriti.webp" alt="Sanskriti Sarees Mill Logo" className="w-10 h-10 object-contain" />
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>,
            "Customer Orders",
            orderCount
          )}

          {navItem(
            "all-products",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>,
            "Inventory / Catalog",
            productCount
          )}

          {navItem(
            "add-product",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>,
            "Publish Saree"
          )}

          {navItem(
            "hero",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>,
            "Hero Carousel"
          )}

          {navItem(
            "blogs",
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>,
            "Journal / Blog"
          )}
        </nav>
      </div>

      <div className="pt-6 border-t border-amber-900/20 space-y-3">
        <button
          onClick={onSeedProducts}
          className="w-full text-xs text-amber-400/80 hover:text-amber-300 py-2.5 px-3 rounded-lg border border-amber-800/30 hover:border-amber-700/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">database</span>
          <span>Seed Initial Data</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full text-xs text-rose-400/80 hover:text-rose-300 py-2.5 px-3 rounded-lg border border-rose-900/30 hover:border-rose-800/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Logout Securely</span>
        </button>
      </div>
    </aside>
  );
}
