import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { items, setIsOpen: setCartOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isDarkBg = location === "/" && !isScrolled;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Desktop Nav - Left */}
        <nav className="hidden md:flex gap-8 items-center font-body text-sm uppercase tracking-widest">
          <Link href="/gallery" className="hover:text-primary transition-colors">Collection</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/commission" className="hover:text-primary transition-colors">Commission</Link>
        </nav>

        {/* Logo */}
        <Link href="/">
          <div className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-center cursor-pointer">
            TASMIYA<br />
            <span className="text-primary text-xl md:text-2xl font-normal">AL-FANN</span>
          </div>
        </Link>

        {/* Desktop Nav - Right */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/gallery">
            <div className="relative cursor-pointer hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-4 h-4 text-[10px] flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </div>
          </Link>
          <button 
            onClick={() => setCartOpen(true)}
            className="relative hover:text-primary transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-4 h-4 text-[10px] flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-background z-[100] flex flex-col p-6"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-8 mt-12 text-2xl font-heading">
              <Link href="/">Home</Link>
              <Link href="/gallery">The Collection</Link>
              <Link href="/about">About the Artist</Link>
              <Link href="/commission">Commission Artwork</Link>
            </nav>
            
            <div className="mt-auto mb-8 flex gap-8 justify-center">
              <Link href="/gallery">
                <div className="flex items-center gap-2 text-lg">
                  <Heart className="w-6 h-6" /> Wishlist ({wishlistItems.length})
                </div>
              </Link>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCartOpen(true);
                }}
                className="flex items-center gap-2 text-lg"
              >
                <ShoppingBag className="w-6 h-6" /> Cart ({cartCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
