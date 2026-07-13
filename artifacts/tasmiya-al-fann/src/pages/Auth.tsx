import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, Eye, EyeOff, ArrowRight, KeyRound, RefreshCcw, ShieldCheck } from "lucide-react";
import { useAuth } from "@/store/auth";

// ─── OTP helpers ──────────────────────────────────────────────────────────────
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Forgot Password 3-step wizard ────────────────────────────────────────────
type ForgotStep = "email" | "otp" | "newpass";

function ForgotPasswordWizard({ onBack }: { onBack: () => void }) {
  const { accounts, resetPassword } = useAuth();
  const [step, setStep] = useState<ForgotStep>("email");
  const [fpEmail, setFpEmail] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const inputCls =
    "w-full pl-11 pr-10 py-3.5 rounded-2xl text-foreground placeholder:text-muted-foreground/50 border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 bg-card/60 transition-all font-body";

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fpEmail.trim()) { setError("Please enter your email address."); return; }
    const exists = accounts.find((a) => a.email.toLowerCase() === fpEmail.toLowerCase());
    if (!exists) {
      setError("No account found with this email address.");
      return;
    }
    const otp = generateOTP();
    setGeneratedOTP(otp);
    setStep("otp");
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (enteredOTP.trim() !== generatedOTP) {
      setError("Incorrect OTP. Please check and try again.");
      return;
    }
    setStep("newpass");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPass.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPass !== confirmPass) { setError("Passwords do not match."); return; }
    resetPassword(fpEmail, newPass);
    setDone(true);
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
          <ShieldCheck size={28} className="text-green-400" />
        </div>
        <h3 className="font-heading text-2xl text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Password Reset!</h3>
        <p className="text-white/50 text-xs font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Your password has been updated successfully. You can now sign in with your new password.
        </p>
        <button
          onClick={onBack}
          className="w-full py-3.5 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Back to Sign In
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-5">
        {(["email", "otp", "newpass"] as ForgotStep[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors ${
              step === s ? "bg-accent text-white" :
              (["email", "otp", "newpass"].indexOf(step) > i) ? "bg-green-500 text-white" :
              "bg-white/10 text-white/40"
            }`}>{i + 1}</div>
            {i < 2 && <div className={`flex-1 h-px ${(["email", "otp", "newpass"].indexOf(step) > i) ? "bg-green-500/60" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl font-body text-center"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Email */}
      {step === "email" && (
        <motion.form key="fp-email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <p className="text-white/50 text-xs font-body mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Enter the email address associated with your account and we'll send you a one-time password.
            </p>
            <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                type="email" required value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                placeholder="your@email.com"
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onBack}
              className="flex-1 py-3.5 border border-white/10 text-white/50 rounded-full text-sm font-semibold hover:border-white/20 hover:text-white/70 transition-colors font-body"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Cancel
            </button>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body flex items-center justify-center gap-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Send OTP <ArrowRight size={14} />
            </motion.button>
          </div>
        </motion.form>
      )}

      {/* Step 2: OTP Verification */}
      {step === "otp" && (
        <motion.form key="fp-otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleVerifyOTP} className="space-y-4">
          {/* OTP display box (simulated email) */}
          <div className="p-4 bg-accent/10 border border-accent/30 rounded-2xl text-center">
            <p className="text-[10px] uppercase tracking-widest text-accent/70 font-body mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              OTP sent to {fpEmail}
            </p>
            <div className="text-3xl font-mono font-bold text-accent tracking-[0.3em] mt-1">{generatedOTP}</div>
            <p className="text-[9px] text-white/30 mt-2 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
              (Displayed here since no email backend is connected)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body">Enter OTP</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                type="text" required maxLength={6} value={enteredOTP}
                onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                className={inputCls + " text-center tracking-[0.4em] font-mono text-base"}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => { setStep("email"); setEnteredOTP(""); setError(null); }}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 font-body transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              <RefreshCcw size={12} /> Resend
            </button>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body flex items-center justify-center gap-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Verify OTP <ArrowRight size={14} />
            </motion.button>
          </div>
        </motion.form>
      )}

      {/* Step 3: New Password */}
      {step === "newpass" && (
        <motion.form key="fp-newpass" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-white/50 text-xs font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
            OTP verified ✓ — Set your new password for <strong className="text-white/70">{fpEmail}</strong>.
          </p>
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                type={showNew ? "text" : "password"} required value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Min. 6 characters"
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                type={showNew ? "text" : "password"} required value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Repeat new password"
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body flex items-center justify-center gap-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Reset Password <ShieldCheck size={15} />
          </motion.button>
        </motion.form>
      )}
    </div>
  );
}

// ─── Main Auth Page ────────────────────────────────────────────────────────────
export default function Auth() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [, setLocation] = useLocation();
  const { signIn, signUp, validateLogin, accounts } = useAuth();

  const queryParams = new URLSearchParams(window.location.search);
  const redirectPath = queryParams.get("redirect") || "/gallery";

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setError(null); setSuccess(null);
    setEmail(""); setPassword(""); setConfirmPassword(""); setFullName("");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }

    // Check if this email is registered
    const accountExists = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!accountExists) {
      // No account — allow guest login (email-only, no prior registration)
      const detectedName = email.split("@")[0];
      const capitalizedName = detectedName.charAt(0).toUpperCase() + detectedName.slice(1);
      signIn(email, capitalizedName, password);
      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => setLocation(redirectPath), 1200);
      return;
    }

    // Account exists — validate password strictly
    const result = validateLogin(email, password);
    if (result === "wrong_password") {
      setError("Incorrect password. Please try again or use Forgot Password.");
      return;
    }

    signIn(accountExists.email, accountExists.name, accountExists.password);
    setSuccess("Logged in successfully! Redirecting...");
    setTimeout(() => setLocation(redirectPath), 1200);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields."); return;
    }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    // Check if already registered
    const alreadyExists = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (alreadyExists) { setError("An account with this email already exists. Please sign in."); return; }

    signUp(email, fullName, password);
    setSuccess("Account created successfully! Redirecting...");
    setTimeout(() => setLocation(redirectPath), 1200);
  };

  const inputCls = "w-full pl-11 pr-10 py-3.5 rounded-2xl text-foreground placeholder:text-muted-foreground/50 border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 bg-card/60 transition-all font-body";
  const labelCls = "block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body";

  return (
    <div
      className="min-h-screen flex items-center justify-center pt-24 pb-32 px-4"
      style={{ background: "radial-gradient(ellipse at 50% 30%, hsl(26 20% 12%) 0%, hsl(0 0% 4%) 100%)" }}
    >
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="text-[10px] tracking-[0.4em] uppercase text-accent/60 mb-2 font-body" style={{ fontFamily: "'Cinzel', serif" }}>
            بيت الفن
          </div>
          <h1 className="font-heading text-4xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {activeTab === "signin" ? "Welcome Back" : activeTab === "signup" ? "Begin Your Journey" : "Reset Password"}
          </h1>
          <p className="text-white/30 text-xs mt-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {activeTab === "signin"
              ? "Sign in to access your dashboard & checkout"
              : activeTab === "signup"
              ? "Create an account to acquire original artwork"
              : "Verify your identity to set a new password"}
          </p>
        </div>

        {/* Tab Swapper — hidden on forgot password view */}
        {activeTab !== "forgot" && (
          <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6">
            <button
              onClick={() => { setActiveTab("signin"); resetForm(); }}
              className={`flex-1 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider font-body transition-all ${activeTab === "signin" ? "bg-accent text-white shadow-md" : "text-white/50 hover:text-white"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >Sign In</button>
            <button
              onClick={() => { setActiveTab("signup"); resetForm(); }}
              className={`flex-1 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider font-body transition-all ${activeTab === "signup" ? "bg-accent text-white shadow-md" : "text-white/50 hover:text-white"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >Create Account</button>
          </div>
        )}

        {/* Form Card */}
        <div className="glassmorphism p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Status alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl font-body text-center"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl font-body text-center"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ── Sign In ── */}
            {activeTab === "signin" && (
              <motion.form key="signin-form" onSubmit={handleSignIn}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }} className="space-y-4">
                <div>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@example.com" className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input type={showPassword ? "text" : "password"} required value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className={inputCls} style={{ fontFamily: "'Poppins', sans-serif" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <button type="button"
                    onClick={() => { setActiveTab("forgot"); setError(null); setSuccess(null); }}
                    className="text-xs text-accent hover:text-accent/80 font-body transition-colors underline underline-offset-4"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Forgot Password?
                  </button>
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body flex items-center justify-center gap-2 mt-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Login <ArrowRight size={16} />
                </motion.button>
              </motion.form>
            )}

            {/* ── Sign Up ── */}
            {activeTab === "signup" && (
              <motion.form key="signup-form" onSubmit={handleSignUp}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }} className="space-y-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Fatima Ali" className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. fatima@example.com" className={inputCls}
                      style={{ fontFamily: "'Poppins', sans-serif" }} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input type={showPassword ? "text" : "password"} required value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                      className={inputCls} style={{ fontFamily: "'Poppins', sans-serif" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input type={showPassword ? "text" : "password"} required value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password"
                      className={inputCls} style={{ fontFamily: "'Poppins', sans-serif" }} />
                  </div>
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body flex items-center justify-center gap-2 mt-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Create Account
                </motion.button>
              </motion.form>
            )}

            {/* ── Forgot Password ── */}
            {activeTab === "forgot" && (
              <motion.div key="forgot-flow"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}>
                <ForgotPasswordWizard onBack={() => { setActiveTab("signin"); setError(null); setSuccess(null); }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
