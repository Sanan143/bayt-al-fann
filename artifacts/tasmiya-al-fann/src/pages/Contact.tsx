import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";

type FormData = { name: string; email: string; phone: string; subject: string; message: string; };

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const onSubmit = (data: FormData) => { console.log(data); setSubmitted(true); };

  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Get In Touch</span>
          <h1 className="font-heading text-5xl sm:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Contact</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
            <div>
              <h2 className="font-heading text-3xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Let's Connect</h2>
              <p className="text-muted-foreground leading-relaxed font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Whether you have a question about an artwork, wish to place a commission, or simply want to share your appreciation — Tasmiya loves to hear from you.
              </p>
            </div>
            <div className="space-y-5">
              {[
                { Icon: Mail, label: "Email", value: "tasmiya@baytafann.com", href: "mailto:tasmiya@baytafann.com" },
                { Icon: MessageCircle, label: "WhatsApp", value: "+91 99999 99999", href: "https://wa.me/+919999999999" },
                { Icon: Phone, label: "Phone", value: "+91 99999 99999", href: "tel:+919999999999" },
                { Icon: MapPin, label: "Studio", value: "Chennai, Tamil Nadu, India", href: "#" },
              ].map(({ Icon, label, value, href }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl glassmorphism hover:border-accent border border-transparent transition-all group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</div>
                    <div className="text-sm font-medium font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-6 glassmorphism rounded-3xl p-10">
                <CheckCircle size={40} className="text-accent" />
                <h3 className="font-heading text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Message Sent</h3>
                <p className="text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Tasmiya will respond within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="glassmorphism rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", name: "name", type: "text", required: true },
                    { label: "Email Address", name: "email", type: "email", required: true },
                    { label: "Phone (optional)", name: "phone", type: "tel", required: false },
                    { label: "Subject", name: "subject", type: "text", required: true },
                  ].map(({ label, name, type, required }) => (
                    <div key={name}>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</label>
                      <input {...register(name as keyof FormData, { required })} type={type}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body"
                        style={{ fontFamily: "'Poppins', sans-serif" }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Message</label>
                  <textarea {...register("message", { required: true })} rows={5}
                    placeholder="Tell Tasmiya what's on your mind..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-body"
                    style={{ fontFamily: "'Poppins', sans-serif" }} />
                </div>
                <motion.button type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-accent transition-colors font-body"
                  whileHover={{ scale: 1.02 }} style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <Send size={15} /> Send Message
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
