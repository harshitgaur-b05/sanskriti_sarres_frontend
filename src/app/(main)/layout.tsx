import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <main className="flex-1 flex flex-col pt-20">{children}</main>
      <Footer />
    </CartProvider>
  );
}
