import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, type CartItem } from "@/store/cart";
import { Link } from "wouter";

let openCartDrawer: (() => void) | null = null;
export function triggerCartDrawer() { openCartDrawer?.(); }

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeItem, total } = useCart();

  // Register open handler for external access
  openCartDrawer = () => setIsOpen(true);

  return (
    <>
      {/* Floating cart button on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[72px] right-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center lg:hidden hover:bg-accent transition-colors"
        aria-label="Open cart"
      >
        <ShoppingBag size={20} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">
            {items.reduce((s, i) => s + i.quantity, 0)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[100]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-[101] shadow-2xl flex flex-col border-l border-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-heading text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Your Cart
                  {items.length > 0 && <span className="text-muted-foreground text-lg ml-2">({items.length})</span>}
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
                    <ShoppingBag size={40} className="opacity-30" />
                    <p className="font-body text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Your cart is empty.</p>
                    <button onClick={() => setIsOpen(false)}
                      className="px-5 py-2.5 border border-border rounded-full text-sm hover:border-primary transition-colors font-body"
                      style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4 border-b border-border/50 pb-5">
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <Link href={`/artwork/${item.id}`}>
                            <h3 className="font-heading text-lg leading-snug hover:text-accent transition-colors cursor-pointer"
                              onClick={() => setIsOpen(false)} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                              {item.title}
                            </h3>
                          </Link>
                          <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-2 flex-shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <span className="font-heading text-xl mt-auto mb-3 text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          ${item.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-3 border border-border rounded-full px-3 py-1.5 w-fit">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="text-sm w-5 text-center font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-card">
                  <div className="flex justify-between mb-2 font-heading text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <span>Subtotal</span>
                    <span>${total().toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Shipping and taxes calculated at checkout.
                  </p>
                  <button className="w-full py-4 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-accent transition-colors font-body"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
