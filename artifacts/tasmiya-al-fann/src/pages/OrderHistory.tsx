import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, Clock, CheckCircle2, Truck, Home, 
  ArrowRight, ShieldAlert, ShoppingBag, Eye, CreditCard, MessageSquare 
} from "lucide-react";
import { useAuth } from "@/store/auth";
import { useOrders, type Order } from "@/store/orders";

type StepStatus = "complete" | "current" | "upcoming";

interface TimelineStepProps {
  label: string;
  sublabel: string;
  status: StepStatus;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

function TimelineStep({ label, sublabel, status, Icon }: TimelineStepProps) {
  const ringCls = 
    status === "complete" 
      ? "bg-accent text-white border-accent ring-4 ring-accent/15" 
      : status === "current"
        ? "bg-card border-accent text-accent ring-4 ring-accent/30 animate-pulse"
        : "bg-card border-border/80 text-muted-foreground/50";

  return (
    <div className="flex-1 flex flex-col items-center relative text-center min-w-[120px]">
      {/* Visual Dot */}
      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all ${ringCls}`}>
        <Icon size={16} />
      </div>
      
      {/* Labels */}
      <div className="mt-3.5 px-2">
        <div className={`text-xs font-semibold uppercase tracking-wider font-body ${status === "upcoming" ? "text-muted-foreground/60" : "text-foreground"}`}>
          {label}
        </div>
        <div className="text-[10px] text-muted-foreground font-body mt-0.5 max-w-[110px] mx-auto leading-relaxed">
          {sublabel}
        </div>
      </div>
    </div>
  );
}

export default function OrderHistory() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { orders } = useOrders();

  // Filter orders for the active user
  const userOrders = user ? orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase()) : [];

  const handleSignInRedirect = () => {
    setLocation("/auth?redirect=/order-history");
  };

  // Stepper steps builder based on status
  const getTimelineSteps = (status: Order["status"], paymentMethod?: "cod" | "qr") => {
    const isQr = paymentMethod === "qr";

    switch (status) {
      case "delivered":
        return [
          { label: "Placed", sublabel: "Order registered", status: "complete" as const, Icon: ClipboardCheck },
          { label: "Paid", sublabel: isQr ? "UPI Payment Confirmed" : "COD Upon Delivery", status: "complete" as const, Icon: CreditCard },
          { label: "Dispatched", sublabel: "Handed to courier", status: "complete" as const, Icon: Truck },
          { label: "Delivered", sublabel: "Received successfully", status: "complete" as const, Icon: Home },
        ];
      case "paid":
        return [
          { label: "Placed", sublabel: "Order registered", status: "complete" as const, Icon: ClipboardCheck },
          { label: "Paid", sublabel: isQr ? "UPI Payment Confirmed" : "COD Confirmed", status: "current" as const, Icon: CreditCard },
          { label: "Preparing", sublabel: "Readying for courier", status: "upcoming" as const, Icon: Truck },
          { label: "Delivered", sublabel: "Awaiting delivery", status: "upcoming" as const, Icon: Home },
        ];
      case "shipped":
        return [
          { label: "Placed", sublabel: "Order registered", status: "complete" as const, Icon: ClipboardCheck },
          { label: "Paid", sublabel: isQr ? "UPI Payment Confirmed" : "COD Confirmed", status: "complete" as const, Icon: CreditCard },
          { label: "Dispatched", sublabel: "Handed to courier", status: "current" as const, Icon: Truck },
          { label: "Delivered", sublabel: "Out for delivery", status: "upcoming" as const, Icon: Home },
        ];
      case "pending":
      default:
        return [
          { label: "Placed", sublabel: "Order registered", status: "complete" as const, Icon: ClipboardCheck },
          { label: "Reviewing", sublabel: isQr ? "Verifying UPI payment" : "Reviewing COD details", status: "current" as const, Icon: Clock },
          { label: "Preparing", sublabel: "Readying for courier", status: "upcoming" as const, Icon: Truck },
          { label: "Delivered", sublabel: "Awaiting delivery", status: "upcoming" as const, Icon: Home },
        ];
    }
  };

  const getProgressWidthClass = (status: Order["status"]) => {
    if (status === "delivered") return "w-full";
    if (status === "shipped") return "w-[76%]";
    if (status === "paid") return "w-[43%]";
    return "w-[12%]";
  };

  return (
    <main className="pt-28 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3 font-body" style={{ fontFamily: "'Cinzel', serif" }}>
            Acquisitions Portal
          </span>
          <h1 className="font-heading text-5xl sm:text-6xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Order History
          </h1>
          <p className="text-muted-foreground text-sm mt-3 font-body max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Track and monitor the secure processing, certification, and courier dispatch of your original art collections.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Guest State */}
          {!user ? (
            <motion.div
              key="auth-guard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glassmorphism p-8 sm:p-10 rounded-3xl text-center max-w-md mx-auto shadow-md"
            >
              <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5 text-accent">
                <Clock size={28} />
              </div>
              <h3 className="font-heading text-2xl text-foreground mb-2 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Authentication Required
              </h3>
              <p className="text-muted-foreground text-sm font-body max-w-xs mx-auto mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Please sign in to access your dashboard, review invoices, and track shipping progress.
              </p>
              <motion.button
                onClick={handleSignInRedirect}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-accent text-white rounded-full text-xs font-semibold uppercase tracking-wider font-body hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Sign In / Create Account <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          ) : userOrders.length === 0 ? (
            /* Logged in, no orders */
            <motion.div
              key="empty-orders-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glassmorphism p-10 rounded-3xl text-center max-w-md mx-auto shadow-md"
            >
              <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-5 text-muted-foreground/60">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-heading text-2xl text-foreground mb-2 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No Acquisitions Yet
              </h3>
              <p className="text-muted-foreground text-sm font-body max-w-xs mx-auto mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                You haven't requested any artworks yet. Check out the Gallery and begin your bespoke collection.
              </p>
              <motion.button
                onClick={() => setLocation("/gallery")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider font-body hover:bg-accent hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Explore Gallery <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          ) : (
            /* Orders Listing & Visual Tracker */
            <motion.div
              key="orders-list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {userOrders.map((order) => {
                const isCancelled = order.status === "cancelled";
                const steps = getTimelineSteps(order.status, order.paymentMethod);

                return (
                  <div 
                    key={order.id} 
                    className="glassmorphism rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-border/60 transition-all duration-300"
                  >
                    {/* Top Order Details Banner */}
                    <div className="p-6 sm:p-8 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] px-2.5 py-0.5 rounded bg-accent/15 text-accent font-semibold tracking-wider font-body">ACQUISITION</span>
                          <span className="font-heading text-xl text-foreground font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{order.id}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-body mt-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Artwork items: <span className="text-foreground font-medium">{order.artwork}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-5 sm:text-right">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/75 font-body">Amount</div>
                          <div className="font-heading text-2xl text-accent font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{order.total}</div>
                        </div>
                        <div className="border-l border-border/40 h-8 hidden sm:block" />
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/75 font-body">Status</div>
                          <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full font-body mt-1 ${
                            isCancelled 
                              ? "bg-red-500/10 text-red-600 border border-red-200/50" 
                              : order.status === "delivered"
                                ? "bg-purple-500/10 text-purple-600 border border-purple-200/50"
                                : order.status === "shipped"
                                  ? "bg-blue-500/10 text-blue-600 border border-blue-200/50"
                                  : order.status === "paid"
                                    ? "bg-green-500/10 text-green-600 border border-green-200/50"
                                    : "bg-amber-500/10 text-amber-600 border border-amber-200/50"
                          }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="p-6 sm:p-8 bg-card/40">
                      <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground/80 font-semibold mb-6 font-body" style={{ fontFamily: "'Cinzel', serif" }}>
                        Delivery & Dispatch Pipeline
                      </h4>

                      {isCancelled ? (
                        /* Cancelled State View */
                        <div className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-200/50 text-red-600 rounded-2xl">
                          <ShieldAlert size={22} className="flex-shrink-0" />
                          <div className="font-body text-xs leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <strong className="block text-sm mb-0.5">Acquisition Suspended</strong>
                            This order registration was marked cancelled. If you believe this is in error, please contact Tasmiya.
                          </div>
                        </div>
                      ) : (
                        /* Visual Progress Line */
                        <div className="relative pt-2 pb-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                          {/* Stepper background line */}
                          <div className="absolute top-5 left-[12%] right-[12%] h-[2px] bg-border/40 hidden md:block z-0" />
                          {/* Dynamic Progress indicator */}
                          <div className={`absolute top-5 left-[12%] h-[2px] bg-accent transition-all duration-700 hidden md:block z-0 ${getProgressWidthClass(order.status)}`} />
                          
                          {steps.map((step, idx) => (
                            <TimelineStep 
                              key={idx}
                              label={step.label}
                              sublabel={step.sublabel}
                              status={step.status}
                              Icon={step.Icon}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Shipping info footer panel */}
                    <div className="px-6 py-4 border-t border-border/40 bg-muted/5 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-muted-foreground gap-3 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <div>
                        Delivery Destination: <span className="text-foreground font-medium">{order.address}</span>
                        <span className="mx-2 text-border">|</span>
                        Payment: <span className="text-foreground font-medium">{order.paymentMethod === "qr" ? "UPI / QR Code" : "Cash on Delivery"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:text-right flex-shrink-0 text-accent hover:text-accent/80 cursor-pointer transition-colors font-semibold" onClick={() => window.open(`https://wa.me/+919999999999?text=Hi! I am asking about order status for "${order.id}"`, "_blank")}>
                        <MessageSquare size={12} /> Contact Curator Support
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
