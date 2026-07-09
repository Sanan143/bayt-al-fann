import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How do I commission a custom artwork?", a: "Fill out the Commission Request form on our website. Tasmiya personally reviews all requests and will respond within 3–5 business days to discuss your vision, timeline, and pricing." },
  { q: "How are artworks shipped?", a: "All artworks are professionally packaged with archival materials, framed or rolled depending on the piece, and shipped via insured courier globally. Standard delivery is 10–21 days internationally." },
  { q: "Does each artwork include a Certificate of Authenticity?", a: "Yes. Every original artwork is accompanied by a hand-signed Certificate of Authenticity from Tasmiya, including the artwork title, dimensions, medium, year, and a unique reference number." },
  { q: "Can I return or exchange an artwork?", a: "Due to the unique nature of original artworks, all sales are final. However, if an artwork arrives damaged, please contact us within 48 hours with photo documentation and we will resolve it immediately." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, PayPal, and bank transfers. For high-value purchases over $5,000, installment payment plans may be arranged — please contact us directly." },
  { q: "Do you offer international shipping?", a: "Yes, we ship worldwide. Shipping costs and timelines vary by destination. All international shipments are fully insured and include tracking." },
  { q: "How long does a commission take?", a: "Commission timelines vary by complexity and size. Small pieces typically take 2–4 weeks; large or complex works may take 6–12 weeks. Tasmiya will provide a specific timeline during consultation." },
  { q: "Are prints or reproductions available?", a: "Currently, we offer original artworks and limited-edition signed prints for select pieces. Contact us for availability and pricing on specific prints." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="font-heading text-lg leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pb-5 text-muted-foreground text-sm leading-relaxed font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Questions & Answers</span>
          <h1 className="font-heading text-5xl sm:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>FAQ</h1>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glassmorphism rounded-3xl px-6 sm:px-10 py-4">
          {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
        </motion.div>
      </div>
    </main>
  );
}
