import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/store/auth";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [location, setLocation] = useLocation();
  const { signIn, signUp } = useAuth();

  // Search parameters for redirecting
  const queryParams = new URLSearchParams(window.location.search);
  const redirectPath = queryParams.get("redirect") || "/gallery";

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    // Mock Login: Simply extract name from email prefix for demo
    const detectedName = email.split("@")[0];
    const capitalizedName = detectedName.charAt(0).toUpperCase() + detectedName.slice(1);
    
    signIn(email, capitalizedName);
    setSuccess("Logged in successfully! Redirecting...");
    
    setTimeout(() => {
      setLocation(redirectPath);
    }, 1200);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    signUp(email, fullName);
    setSuccess("Account created successfully! Redirecting...");

    setTimeout(() => {
      setLocation(redirectPath);
    }, 1200);
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }
    setError(null);
    setSuccess(`A password reset link has been sent to ${email} (simulated).`);
  };

  const inputCls = "w-full pl-11 pr-10 py-3.5 rounded-2xl text-foreground placeholder:text-muted-foreground/50 border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 bg-card/60 transition-all font-body";
  const labelCls = "block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body";

  return (
    <div 
      className="min-h-screen flex items-center justify-center pt-24 pb-32 px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, hsl(26 20% 12%) 0%, hsl(0 0% 4%) 100%)"
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="text-[10px] tracking-[0.4em] uppercase text-accent/60 mb-2 font-body" style={{ fontFamily: "'Cinzel', serif" }}>
            بيت الفن
          </div>
          <h1 className="font-heading text-4xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {activeTab === "signin" ? "Welcome Back" : "Begin Your Journey"}
          </h1>
          <p className="text-white/30 text-xs mt-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {activeTab === "signin" ? "Sign in to access your dashboard & checkout" : "Create an account to acquire original artwork"}
          </p>
        </div>

        {/* Tab Swapping */}
        <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6">
          <button
            onClick={() => { setActiveTab("signin"); setError(null); setSuccess(null); }}
            className={`flex-1 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider font-body transition-all ${activeTab === "signin" ? "bg-accent text-white shadow-md" : "text-white/50 hover:text-white"}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab("signup"); setError(null); setSuccess(null); }}
            className={`flex-1 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider font-body transition-all ${activeTab === "signup" ? "bg-accent text-white shadow-md" : "text-white/50 hover:text-white"}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Create Account
          </button>
        </div>

        {/* Form Container */}
        <div className="glassmorphism p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Status Indicators */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl font-body text-center"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl font-body text-center"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === "signin" ? (
              <motion.form
                key="signin-form"
                onSubmit={handleSignIn}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
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
                      placeholder="e.g. customer@example.com"
                      className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-accent hover:text-accent/80 font-body transition-colors underline underline-offset-4"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body flex items-center justify-center gap-2 mt-4"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Login <ArrowRight size={16} />
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                onSubmit={handleSignUp}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className={labelCls}>Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
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
                      placeholder="e.g. fatima@example.com"
                      className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body flex items-center justify-center gap-2 mt-4"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Create Account
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
