import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Home, LayoutGrid, Brush, BookOpen, Info, User } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { triggerCartDrawer } from "@/components/CartDrawer";
import { DarkModeToggle } from "@/components/DarkModeToggle";

// Public navigation links (Admin portal excluded from main nav for security)
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
  { href: "/order-history", label: "Order History" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/commission", label: "Commission" },
];

const BOTTOM_NAV = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/gallery", label: "Gallery", Icon: LayoutGrid },
  { href: "/shop", label: "Shop", Icon: Brush },
  { href: "/blog", label: "Blog", Icon: BookOpen },
  { href: "/about", label: "About", Icon: Info },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { items } = useCart();
  const { user } = useAuth();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user && cartCount > 0) {
      setLocation("/checkout");
    } else {
      triggerCartDrawer();
    }
  };

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { closeMenu(); }, [location, closeMenu]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Desktop / Top Navbar ── */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glassmorphism shadow-lg py-2" : "bg-transparent py-4"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex flex-col leading-none cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <span
                className="font-subheading text-[10px] tracking-[0.4em] uppercase text-primary/70"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                بيت الفن
              </span>
              <span
                className="font-heading text-xl font-semibold tracking-tight text-foreground"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Bayt Al Fann
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.slice(0, 6).map(({ href, label }) => (
              <Link key={href} href={href}>
                <span
                  className={`relative text-sm tracking-wide transition-colors cursor-pointer font-body
                    ${location === href ? "text-accent" : "text-foreground/70 hover:text-foreground"}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  aria-current={location === href ? "page" : undefined}
                >
                  {label}
                  {location === href && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                      layoutId="nav-underline"
                    />
                  )}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <DarkModeToggle />

            <Link href="/admin">
              <motion.button
                className="hidden sm:block text-[11px] tracking-widest uppercase px-3 py-1.5 text-foreground/60 hover:text-accent transition-all font-body hover:bg-accent/5 rounded-full"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ fontFamily: "'Poppins', sans-serif" }}
                aria-label="Admin portal"
              >
                Admin
              </motion.button>
            </Link>

            <Link href="/commission">
              <motion.button
                className="hidden sm:block text-xs tracking-widest uppercase px-4 py-2 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all rounded-full font-body"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ fontFamily: "'Poppins', sans-serif" }}
                aria-label="Commission an artwork"
              >
                Commission
              </motion.button>
            </Link>

            <motion.button
              onClick={handleCartClick}
              className="relative p-2.5 rounded-full hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Shopping cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
            >
              <ShoppingBag size={20} className="text-foreground" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-[10px] font-semibold text-white flex items-center justify-center" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {user ? (
              <Link href="/profile">
                <motion.button
                  className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center text-[10px] font-bold font-body cursor-pointer hover:bg-accent hover:text-white transition-all shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  aria-label={`Profile for ${user.name}`}
                >
                  {user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </motion.button>
              </Link>
            ) : (
              <Link href="/auth">
                <motion.button
                  className="p-2.5 rounded-full hover:bg-primary/10 transition-colors cursor-pointer text-foreground/75 hover:text-foreground flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Sign in to your account"
                >
                  <User size={18} aria-hidden="true" />
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              className="lg:hidden p-2.5 rounded-full hover:bg-primary/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Full-Screen Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-40 glassmorphism flex flex-col justify-center items-center gap-8 lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={href}>
                  <span
                    className={`text-3xl font-heading cursor-pointer block text-center
                      ${location === href ? "text-accent" : "text-foreground/80 hover:text-foreground"}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    aria-current={location === href ? "page" : undefined}
                  >
                    {label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky Bottom Navigation (Mobile) ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glassmorphism border-t border-border/50 safe-area-pb"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around py-2">
          {BOTTOM_NAV.map(({ href, label, Icon }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <motion.div
                  className="flex flex-col items-center gap-0.5 min-w-[52px] py-1 cursor-pointer"
                  whileTap={{ scale: 0.88 }}
                >
                  <motion.div
                    animate={{ scale: active ? 1.2 : 1, y: active ? -2 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Icon
                      size={22}
                      className={active ? "text-accent" : "text-muted-foreground"}
                      strokeWidth={active ? 2 : 1.5}
                    />
                  </motion.div>
                  <span
                    className={`text-[9px] tracking-wide font-body transition-colors ${
                      active ? "text-accent font-semibold" : "text-muted-foreground"
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {label}
                  </span>
                  {active && (
                    <motion.div
                      className="w-1 h-1 rounded-full bg-accent mt-0.5"
                      layoutId="bottom-nav-dot"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
          {/* Cart shortcut in bottom nav */}
          <motion.div
            onClick={handleCartClick}
            className="flex flex-col items-center gap-0.5 min-w-[52px] py-1 cursor-pointer"
            whileTap={{ scale: 0.88 }}
          >
            <div className="relative">
              <ShoppingBag
                size={22}
                className={location === "/checkout" ? "text-accent" : "text-muted-foreground"}
                strokeWidth={location === "/checkout" ? 2 : 1.5}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-[8px] font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span
              className={`text-[9px] tracking-wide font-body ${
                location === "/checkout" ? "text-accent font-semibold" : "text-muted-foreground"
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Cart
            </span>
          </motion.div>
        </div>
      </nav>
    </>
  );
}
