import { motion } from "framer-motion";
import { Link } from "wouter";
import { MessageCircle, Award, Palette, Heart } from "lucide-react";

const TIMELINE = [
  { year: "2016", title: "First Brushstroke", desc: "Began formal study of Islamic art and Arabic calligraphy in Chennai." },
  { year: "2018", title: "First Solo Exhibition", desc: "Debut exhibition 'Whispers of the Desert' showcased at City Gallery." },
  { year: "2020", title: "International Recognition", desc: "Featured in Dubai Art Week and collector acquisitions across the Gulf." },
  { year: "2022", title: "Studio Launch", desc: "Opened Bayt Al Fann studio — a sanctuary of creation and commission." },
  { year: "2024", title: "Digital Expansion", desc: "Launched this platform to bring the gallery to collectors worldwide." },
  { year: "2025", title: "Present", desc: "Creating, exhibiting, and commissioning bespoke works globally." },
];

const AWARDS = [
  "Best Emerging Artist — Dubai Art Week 2020",
  "Islamic Art Excellence Award — 2021",
  "Featured Artist — Sharjah Biennial 2022",
  "Collector's Choice Award — GCC Art Fair 2023",
];

export default function About() {
  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
            <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-4" style={{ fontFamily: "'Cinzel', serif" }}>The Artist</span>
            <h1 className="font-heading text-5xl sm:text-6xl font-light leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Tasmiya<br /><em className="text-primary/60">Fathima Azeez</em>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-5 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Tasmiya Fathima Azeez is an artist driven by a singular vision: to capture the stillness often lost in our modern world. Her work is deeply rooted in the traditions of Islamic geometry and Arabic calligraphy, reimagined through a lens of modern editorial minimalism.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Each canvas becomes a meditation — a space where ancient sacred patterns meet the quiet beauty of negative space, inviting the viewer to slow down, breathe, and simply be.
            </p>
            <div className="flex gap-4">
              <Link href="/commission">
                <motion.button className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-accent transition-colors font-body" whileHover={{ scale: 1.04 }} style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Commission Work
                </motion.button>
              </Link>
              <a href="https://wa.me/+919999999999" target="_blank" rel="noopener noreferrer">
                <motion.button className="px-6 py-3 border border-primary/40 rounded-full text-sm text-primary hover:border-accent hover:text-accent transition-colors flex items-center gap-2 font-body" whileHover={{ scale: 1.04 }} style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <MessageCircle size={15} /> WhatsApp
                </motion.button>
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted">
              <img src="/images/portrait.png" alt="Tasmiya Fathima Azeez Portrait" className="w-full h-full object-cover" />
            </div>
            {/* Floating stat cards */}
            <motion.div className="absolute -top-4 -right-4 glassmorphism p-5 rounded-2xl shadow-xl"
              animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}>
              <div className="flex items-center gap-3">
                <Palette className="text-accent" size={22} />
                <div>
                  <div className="text-2xl font-heading" style={{ fontFamily: "'Cormorant Garamond', serif" }}>200+</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Artworks Created</div>
                </div>
              </div>
            </motion.div>
            <motion.div className="absolute -bottom-4 -left-4 glassmorphism p-5 rounded-2xl shadow-xl"
              animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
              <div className="flex items-center gap-3">
                <Heart className="text-accent" size={22} />
                <div>
                  <div className="text-2xl font-heading" style={{ fontFamily: "'Cormorant Garamond', serif" }}>150+</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Happy Collectors</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <section className="bg-foreground/[0.02] py-20 mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>The Journey</span>
            <h2 className="font-heading text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>A Creative Timeline</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-[28px] sm:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            {TIMELINE.map((item, i) => (
              <motion.div key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex gap-6 mb-10 sm:mb-14 ${i % 2 === 0 ? "sm:flex-row-reverse sm:text-right" : "sm:flex-row"} items-start sm:items-center`}>
                {/* Content */}
                <div className="sm:w-[calc(50%-2rem)] pl-16 sm:pl-0">
                  <span className="text-xs tracking-widest uppercase text-accent font-body" style={{ fontFamily: "'Cinzel', serif" }}>{item.year}</span>
                  <h3 className="font-heading text-xl mt-1 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.desc}</p>
                </div>
                {/* Dot */}
                <div className="absolute left-5 sm:left-1/2 sm:-translate-x-1/2 w-5 h-5 rounded-full border-2 border-accent bg-background flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Recognition</span>
          <h2 className="font-heading text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Awards & Honors</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AWARDS.map((award, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 glassmorphism p-5 rounded-2xl">
              <Award size={20} className="text-accent mt-0.5 flex-shrink-0" />
              <p className="text-sm font-body leading-snug" style={{ fontFamily: "'Poppins', sans-serif" }}>{award}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Inspirations */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>The Muse</span>
          <h2 className="font-heading text-4xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Inspirations</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { title: "Islamic Geometry", desc: "The infinite, repeating patterns of Islamic art represent divine order and mathematical beauty." },
            { title: "Arabic Calligraphy", desc: "The flowing script of Arabic transforms sacred words into visual music." },
            { title: "Desert Light", desc: "The shifting hues of golden hour in the desert inspire every warm palette." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="glassmorphism p-6 rounded-2xl text-center">
              <h3 className="font-heading text-xl mb-3 text-accent" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</h3>
              <p className="text-muted-foreground text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
