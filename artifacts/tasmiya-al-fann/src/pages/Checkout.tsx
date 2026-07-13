import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShoppingBag, ArrowLeft, CreditCard, MessageCircle, ClipboardCheck, Minus, Plus, Trash2, QrCode, Coins } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useOrders, type Order } from "@/store/orders";

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { items, total, clearCart, updateQuantity, removeItem } = useCart();
  const { addOrder } = useOrders();

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth?redirect=/checkout");
    }
  }, [user, setLocation]);

  // Form states
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "qr">("cod");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  
  // Checkout success state
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <p className="text-muted-foreground text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Redirecting to Sign In...
        </p>
      </div>
    );
  }

  if (items.length === 0 && !successOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
        <ShoppingBag size={48} className="text-muted-foreground opacity-45" />
        <h2 className="font-heading text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Your Cart is Empty
        </h2>
        <button
          onClick={() => setLocation("/gallery")}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:bg-accent transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      alert("Please fill in all shipping details.");
      return;
    }

    if (paymentMethod === "qr" && !paymentProof) {
      alert("Please upload your UPI payment proof screenshot to complete your order.");
      return;
    }
 
    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderId = `#10${Math.floor(10 + Math.random() * 90)}`; // Generates #10XX
      const artworkNames = items.map((i) => `${i.title} (x${i.quantity})`).join(", ");
      const orderTotal = `₹${total().toLocaleString()}`;
      const fullAddressString = `${address}, ${city}, ${state} - ${zip}`;

      const newOrder: Order = {
        id: orderId,
        customer: fullName,
        email,
        phone,
        address: fullAddressString,
        artwork: artworkNames,
        total: orderTotal,
        status: "pending",
        paymentMethod,
        paymentProof: paymentProof || undefined,
      };

      addOrder(newOrder);
      setSuccessOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
    }, 1500);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body transition-colors";
  const labelCls = "block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body";

  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {!successOrder ? (
            <motion.div
              key="checkout-form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Left Column - Shipping Details Form */}
              <div className="lg:col-span-7">
                <button
                  onClick={() => setLocation("/gallery")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm font-body"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <ArrowLeft size={15} /> Continue Shopping
                </button>
                
                <h1 className="font-heading text-4xl mb-6 font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Shipping & Order Details
                </h1>

                <form onSubmit={handleSubmit} className="glassmorphism p-6 sm:p-8 rounded-3xl space-y-5 border border-border/50">
                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Fatima Ali"
                        className={inputCls}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. fatima@example.com"
                        className={inputCls}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelCls}>Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 XXXXX XXXXX"
                      className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelCls}>Shipping Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, apartment, suite..."
                      className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className={inputCls}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className={inputCls}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>ZIP / Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="PIN Code"
                        className={inputCls}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className={labelCls}>Payment Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div 
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${paymentMethod === "cod" ? "border-accent bg-accent/5" : "border-border/60 hover:border-accent/40"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Cash on Delivery (COD)</span>
                          <Coins size={16} className={paymentMethod === "cod" ? "text-accent" : "text-muted-foreground"} />
                        </div>
                        <span className="text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Pay with cash upon delivery of your artwork to your doorstep.
                        </span>
                      </div>
                      <div 
                        onClick={() => setPaymentMethod("qr")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${paymentMethod === "qr" ? "border-accent bg-accent/5" : "border-border/60 hover:border-accent/40"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>UPI / QR Code</span>
                          <QrCode size={16} className={paymentMethod === "qr" ? "text-accent" : "text-muted-foreground"} />
                        </div>
                        <span className="text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Scan the payment QR code below with GPay, PhonePe, or Paytm.
                        </span>
                      </div>
                    </div>

                    {/* QR Code Scan Area */}
                    {paymentMethod === "qr" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-5 bg-muted/30 border border-border/80 rounded-2xl flex flex-col items-center gap-3 mt-4 text-center overflow-hidden"
                      >
                        <div className="w-44 h-44 rounded-xl overflow-hidden border border-border/80 bg-white p-2.5 shadow-sm">
                          <img src="/images/upi_qr_code.png" alt="UPI Payment QR Code" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-accent block font-body">Scan to Pay</span>
                          <span className="text-xs text-muted-foreground font-body leading-relaxed mt-1 block" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            UPI ID: <strong className="text-foreground">tasmiyaazeez1@okaxis</strong><br />
                            Tasmiya Fathima Azeez
                          </span>
                        </div>

                        {/* File Upload for Proof */}
                        <div className="w-full border-t border-border/50 pt-4 text-left">
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-foreground/75 mb-2 font-body">
                            Upload Payment Proof (Screenshot) <span className="text-red-500">*</span>
                          </label>
                          
                          {paymentProof ? (
                            <div className="relative rounded-xl overflow-hidden border border-border bg-card p-2 flex items-center gap-3">
                              <img src={paymentProof} alt="Receipt preview" className="w-12 h-12 rounded object-cover border border-border" />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold text-foreground truncate block">receipt_screenshot.png</span>
                                <span className="text-[10px] text-green-600 font-medium block">✓ Screenshot uploaded successfully</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setPaymentProof(null)}
                                className="text-xs text-muted-foreground hover:text-destructive font-semibold px-2 py-1 rounded hover:bg-muted/80 transition-colors"
                              >
                                Change
                              </button>
                            </div>
                          ) : (
                            <div className="relative border-2 border-dashed border-border/80 rounded-xl p-4 text-center hover:bg-muted/20 hover:border-accent/40 transition-colors cursor-pointer">
                              <input 
                                type="file" 
                                accept="image/*"
                                required
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setPaymentProof(ev.target?.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10" 
                              />
                              <span className="text-xs text-muted-foreground font-body block" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Click or drag screen to upload receipt screenshot
                              </span>
                              <span className="text-[10px] text-muted-foreground/60 font-body block mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                PNG, JPG, or JPEG (Max 5MB)
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-accent transition-colors font-body flex items-center justify-center gap-2 mt-6"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {isSubmitting ? "Processing Order..." : "Place Order"}
                  </motion.button>
                </form>
              </div>

              {/* Right Column - Cart Summary */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-border/50">
                  <h2 className="font-heading text-2xl border-b border-border/50 pb-4 mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Order Summary
                  </h2>
                  <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-14 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading text-base leading-snug truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2.5 mt-1.5">
                            <div className="flex items-center gap-2 border border-border/60 rounded-full px-2 py-0.5 w-fit bg-background/50">
                              <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                                <Minus size={10} />
                              </button>
                              <span className="text-xs w-4 text-center font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                                <Plus size={10} />
                              </button>
                            </div>
                            <button type="button" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title="Remove item">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <span className="font-heading text-lg text-foreground flex-shrink-0 mt-auto mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border/50 pt-5 space-y-3 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="text-foreground">₹{total().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Taxes & Duties</span>
                      <span className="text-foreground">Included</span>
                    </div>
                    <div className="border-t border-border/50 pt-4 flex justify-between font-heading text-2xl font-semibold text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      <span>Total</span>
                      <span>₹{total().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Checkout Success Screen */
            <motion.div
              key="checkout-success-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-lg mx-auto py-12"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500 animate-pulse" />
              </div>
              <h1 className="font-heading text-5xl mb-4 font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Order Confirmed
              </h1>
              <p className="text-muted-foreground font-body mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Thank you for acquiring original artwork. Your order reference number is{" "}
                <strong className="text-foreground">{successOrder.id}</strong>.
              </p>

              {/* Order Info Card */}
              <div className="glassmorphism p-6 rounded-2xl border border-border/50 text-left space-y-3 mb-8">
                <div className="flex justify-between border-b border-border/30 pb-2.5">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Ship To</span>
                  <span className="text-sm font-semibold font-body text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>{successOrder.customer}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-2.5">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Artworks Purchased</span>
                  <span className="text-sm font-semibold font-body text-foreground max-w-[250px] text-right truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{successOrder.artwork}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-2.5">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Amount Charged</span>
                  <span className="text-sm font-semibold font-body text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>{successOrder.total}</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment Method</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent/15 text-accent font-body uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {successOrder.paymentMethod === "qr" ? "UPI / QR Code" : "Cash on Delivery"}
                  </span>
                </div>
              </div>

              <div className="space-y-4 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  A verification email has been dispatched. Tasmiya reviews all orders personally and will contact you within 24 hours to arrange secure transfer and delivery.
                </p>
                <div className="flex justify-center gap-3 pt-4">
                  <button
                    onClick={() => setLocation("/gallery")}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    Back to Gallery
                  </button>
                  <button
                    onClick={() => setLocation("/admin")}
                    className="px-6 py-3 border border-border hover:border-primary rounded-full text-sm font-semibold transition-colors"
                  >
                    Check Admin Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
