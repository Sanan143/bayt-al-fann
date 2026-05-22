import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-[101] shadow-2xl flex flex-col border-l border-border"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading text-2xl">Your Cart</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
                  <p className="font-body">Your cart is empty.</p>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="font-heading rounded-none"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.artwork.id} className="flex gap-4 border-b border-border pb-6">
                    <img 
                      src={item.artwork.image} 
                      alt={item.artwork.title}
                      className="w-24 h-32 object-cover"
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <Link href={`/artwork/${item.artwork.id}`}>
                          <h3 className="font-heading text-lg hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                            {item.artwork.title}
                          </h3>
                        </Link>
                        <button 
                          onClick={() => removeItem(item.artwork.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground font-body mt-1">
                        {item.artwork.category}
                      </p>
                      <p className="text-sm font-medium mt-auto">
                        ${item.artwork.price}
                      </p>
                      <div className="flex items-center gap-4 mt-4 border border-border w-fit px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.artwork.id, Math.max(1, item.quantity - 1))}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-card">
                <div className="flex justify-between mb-4 font-heading text-xl">
                  <span>Subtotal</span>
                  <span>${total}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6 font-body">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button className="w-full rounded-none font-heading text-lg h-12 bg-primary hover:bg-primary/90">
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
