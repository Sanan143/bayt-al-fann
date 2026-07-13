import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Brush, Ruler, DollarSign, FileText, CheckCircle } from "lucide-react";

const STYLES = ["Abstract", "Islamic Geometric", "Arabic Calligraphy", "Portrait", "Nature & Landscapes", "Mixed Media"];
const BUDGETS = ["₹40,000 – ₹80,000", "₹80,000 – ₹2,00,000", "₹2,00,000 – ₹4,00,000", "₹4,00,000 – ₹8,00,000", "₹8,00,000+"];
const SIZES = ["Small (up to 40×40 cm)", "Medium (40–80 cm)", "Large (80–120 cm)", "Extra Large (120cm+)", "Custom"];

type FormData = { customerName: string; customerEmail: string; customerPhone: string; stylePreference: string; budgetRange: string; notes: string; size: string; };

export default function Commission() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  const selectedStyle = watch("stylePreference");
  const selectedBudget = watch("budgetRange");

  const onSubmit = (data: FormData) => { console.log(data); setSubmitted(true); };

  const steps = [
    { icon: Brush, label: "Style" },
    { icon: Ruler, label: "Size & Budget" },
    { icon: FileText, label: "Details" },
  ];

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24 pb-40 lg:pb-16 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-accent" />
          </div>
          <h2 className="font-heading text-4xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Request Received</h2>
          <p className="text-muted-foreground font-body mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Thank you for your interest. Tasmiya reviews all commissions personally and will be in touch within 3–5 business days to discuss your vision.
          </p>
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
            ✦ You will receive a confirmation email shortly ✦
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Bespoke Artworks</span>
          <h1 className="font-heading text-5xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Commission a Piece</h1>
          <p className="text-muted-foreground text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Collaborate with Tasmiya to create a bespoke piece tailored to your space and vision.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map(({ icon: Icon, label }, i) => {
            const s = i + 1;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs transition-all ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Icon size={15} />
                </div>
                <span className={`text-xs font-body hidden sm:block ${step >= s ? "text-foreground" : "text-muted-foreground"}`} style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</span>
                {i < steps.length - 1 && <div className={`w-8 h-px ${step > s ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glassmorphism rounded-3xl p-6 sm:p-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-heading text-2xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Choose a Style</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {STYLES.map(style => (
                  <button type="button" key={style} onClick={() => setValue("stylePreference", style)}
                    className={`p-4 rounded-2xl border text-sm text-left transition-all font-body ${selectedStyle === style ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-primary"}`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {style}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setStep(2)} disabled={!selectedStyle}
                className="w-full py-4 bg-primary text-primary-foreground rounded-full text-sm font-semibold disabled:opacity-40 transition-all hover:bg-accent font-body"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-heading text-2xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Size & Budget</h2>
              <div className="mb-6">
                <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-3 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Canvas Size</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button type="button" key={s} onClick={() => setValue("size" as any, s)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all font-body ${(watch("size" as any)) === s ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-primary"}`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-3 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Budget Range</label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map(b => (
                    <button type="button" key={b} onClick={() => setValue("budgetRange", b)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all font-body ${selectedBudget === b ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-primary"}`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border border-border rounded-full text-sm hover:border-primary transition-colors font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Back</button>
                <button type="button" onClick={() => setStep(3)} disabled={!selectedBudget} className="flex-1 py-4 bg-primary text-primary-foreground rounded-full text-sm font-semibold disabled:opacity-40 hover:bg-accent transition-colors font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Continue</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-heading text-2xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your Details</h2>
              <div className="space-y-4 mb-6">
                {[
                  { label: "Full Name", name: "customerName", type: "text", placeholder: "Your full name" },
                  { label: "Email Address", name: "customerEmail", type: "email", placeholder: "your@email.com" },
                  { label: "Phone / WhatsApp", name: "customerPhone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</label>
                    <input {...register(name as keyof FormData, { required: true })} type={type} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body" style={{ fontFamily: "'Poppins', sans-serif" }} />
                  </div>
                ))}
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Vision & Notes</label>
                  <textarea {...register("notes", { required: true })} rows={4} placeholder="Describe your vision, preferred colors, intended space, any inspiration..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-body" style={{ fontFamily: "'Poppins', sans-serif" }} />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 border border-border rounded-full text-sm hover:border-primary transition-colors font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Back</button>
                <button type="submit" className="flex-1 py-4 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Submit Request</button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </main>
  );
}
