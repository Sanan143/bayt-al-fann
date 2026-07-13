import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, MessageSquare, Save, LogOut, Send, ShoppingBag } from "lucide-react";
import { useAuth } from "@/store/auth";
import { useMessages } from "@/store/messages";
import { useOrders } from "@/store/orders";

export default function Profile() {
  const [location, setLocation] = useLocation();
  const { user, updateProfile, signOut } = useAuth();
  const { messages, sendMessage } = useMessages();
  const { orders } = useOrders();

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth?redirect=/profile");
    }
  }, [user, setLocation]);

  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");

  // Form states
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Chat message state
  const [newMsg, setNewMsg] = useState("");

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

  // Retrieve user orders count
  const userOrdersCount = orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase()).length;

  // Retrieve user message thread
  const userMessages = messages.filter((m) => m.email.toLowerCase() === user.email.toLowerCase());

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    if (!fullName.trim() || !email.trim()) {
      alert("Name and email cannot be empty.");
      return;
    }
    updateProfile(email, fullName);
    setSuccessMsg("Account details updated successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    sendMessage(user.email, "user", user.name, newMsg.trim());
    setNewMsg("");
  };

  const handleLogOut = () => {
    signOut();
    setLocation("/");
  };

  const inputCls = "w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body transition-colors";
  const labelCls = "block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body";

  // Initials for avatar
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="pt-28 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Profile Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-border/60 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center text-2xl font-bold font-body mx-auto mb-4">
                {initials}
              </div>
              <h2 className="font-heading text-2xl text-foreground font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {user.name}
              </h2>
              <p className="text-muted-foreground text-xs font-body mb-6 mt-1 break-all" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {user.email}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-border/40 py-5 mb-6 text-left">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Acquisitions</div>
                  <div className="font-heading text-2xl text-foreground mt-0.5 font-medium flex items-center gap-1.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <ShoppingBag size={14} className="text-accent" /> {userOrdersCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Messages</div>
                  <div className="font-heading text-2xl text-foreground mt-0.5 font-medium flex items-center gap-1.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <MessageSquare size={14} className="text-accent" /> {userMessages.length}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleLogOut}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 border border-destructive/30 text-destructive rounded-full text-xs font-semibold uppercase tracking-wider font-body hover:bg-destructive/5 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <LogOut size={13} /> Sign Out
              </motion.button>
            </div>

            {/* Tab Swapper */}
            <div className="glassmorphism p-2 rounded-2xl border border-border/50 flex flex-col gap-1.5 shadow-sm">
              <button
                onClick={() => setActiveTab("details")}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider font-body transition-all flex items-center gap-2.5 ${activeTab === "details" ? "bg-accent text-white shadow-md" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <User size={14} /> Account Details
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider font-body transition-all flex items-center justify-between ${activeTab === "chat" ? "bg-accent text-white shadow-md" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="flex items-center gap-2.5"><MessageSquare size={14} /> Message Curator</span>
                {userMessages.filter(m => m.sender === "admin").length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold">Curator Reply</span>
                )}
              </button>
            </div>
          </div>

          {/* Right Main Details/Chat Pane */}
          <div className="lg:col-span-8">
            <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm min-h-[480px] flex flex-col">
              
              <AnimatePresence mode="wait">
                {activeTab === "details" ? (
                  /* Edit Details Panel */
                  <motion.div
                    key="details-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-heading text-2xl border-b border-border/40 pb-4 mb-6 font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Account Details
                      </h3>

                      {successMsg && (
                        <div className="mb-5 p-3.5 bg-green-500/10 border border-green-500/20 text-green-700 text-xs rounded-xl font-body text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {successMsg}
                        </div>
                      )}

                      <form onSubmit={handleSaveProfile} className="space-y-5">
                        {/* Name */}
                        <div>
                          <label className={labelCls}>Full Name</label>
                          <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Your full name"
                              className={inputCls}
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className={labelCls}>Email Address</label>
                          <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Your email address"
                              className={inputCls}
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider font-body hover:bg-accent hover:text-white transition-all flex items-center gap-2"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            <Save size={13} /> Save Changes
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                ) : (
                  /* Live Messaging Panel */
                  <motion.div
                    key="chat-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col h-full justify-between"
                  >
                    <div className="border-b border-border/40 pb-4 mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          Curator Conversation
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-body mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Discuss customizations, framing options, or delivery details directly.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-accent font-semibold uppercase tracking-wider font-body">
                        <span className="w-2 h-2 rounded-full bg-accent animate-ping" /> Curator Online
                      </div>
                    </div>

                    {/* Chat Bubble Thread container */}
                    <div className="flex-1 max-h-[300px] min-h-[220px] overflow-y-auto pr-1 space-y-4 mb-4">
                      {userMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground/60 py-10 font-body">
                          <MessageSquare size={24} className="opacity-45 mb-2 text-accent" />
                          <p className="text-xs">No message history. Initiate a chat below to ask Tasmiya questions!</p>
                        </div>
                      ) : (
                        userMessages.map((msg) => {
                          const isAdminSender = msg.sender === "admin";
                          return (
                            <div 
                              key={msg.id}
                              className={`flex flex-col max-w-[80%] ${isAdminSender ? "mr-auto items-start" : "ml-auto items-end"}`}
                            >
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1 px-1 font-body">
                                {isAdminSender ? "Tasmiya (Curator)" : "You"}
                              </span>
                              <div className={`p-3.5 rounded-2xl text-sm font-body leading-relaxed ${
                                isAdminSender 
                                  ? "bg-muted text-foreground rounded-tl-none border border-border/50" 
                                  : "bg-primary text-primary-foreground rounded-tr-none"
                              }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {msg.text}
                              </div>
                              <span className="text-[8px] text-muted-foreground/70 mt-1 px-1 font-body">
                                {msg.timestamp}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Chat input box */}
                    <form onSubmit={handleSendChat} className="border-t border-border/40 pt-4 flex gap-2">
                      <input
                        type="text"
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        placeholder="Type your message to the curator..."
                        className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors flex items-center justify-center"
                      >
                        <Send size={15} />
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
