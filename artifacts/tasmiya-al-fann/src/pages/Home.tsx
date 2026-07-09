import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Hero } from "@/components/Hero";
import { ArtworkCard } from "@/components/ArtworkCard";
import { useArtworksStore } from "@/store/artworks";

import { ChevronRight, Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  { author: "Aisha Rahman", role: "Art Collector, Dubai", rating: 5, content: "Tasmiya's work transcends ordinary art. Each piece carries a spiritual depth that transforms the space around it." },
  { author: "Kareem Al-Hassan", role: "Interior Designer, London", rating: 5, content: "I've commissioned three pieces. The craftsmanship, storytelling, and delivery exceeded every expectation." },
  { author: "Fatima Noor", role: "Gallery Curator", rating: 5, content: "A rare talent that bridges ancient Islamic tradition with contemporary expression. Simply breathtaking." },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as [number, number, number, number], delay },
  };
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { artworks, categories } = useArtworksStore();
  const featured = artworks.filter(a => a.isFeatured).slice(0, 6);
  const newArrivals = artworks.slice(0, 4);

  return (
    <main className="relative z-10">
      <Hero />

      {/* ── Featured Artworks ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold font-body block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
            Curated Selection
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Featured Works
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((artwork, i) => (
            <motion.div key={artwork.id} {...fadeUp(i * 0.1)}>
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </div>
        <motion.div {...fadeUp(0.3)} className="text-center mt-12">
          <Link href="/gallery">
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary/40 text-primary rounded-full text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-all font-body"
              whileHover={{ scale: 1.04 }}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              View All Gallery <ChevronRight size={14} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── Artist Introduction ── */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted">
                <img src="/images/portrait.png" alt="Tasmiya Fathima Azeez" className="w-full h-full object-cover" />
              </div>
              {/* Floating gold accent card */}
              <motion.div
                className="absolute -bottom-6 -right-6 glassmorphism p-6 rounded-2xl shadow-xl max-w-[180px]"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="text-3xl font-heading text-accent" style={{ fontFamily: "'Cormorant Garamond', serif" }}>8+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Years of mastery</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold font-body block mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                The Artist
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-light leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Tasmiya<br /><em>Fathima Azeez</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Based in her sun-drenched studio, Tasmiya's work explores the delicate balance between modern minimalism and ancient Islamic geometries. Each piece is an invitation to slow down, to observe the interplay of shadow and warmth, and to find beauty in intentional restraint.
              </p>
              <blockquote className="border-l-2 border-accent pl-4 mb-8 italic text-foreground/70 font-heading text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "Art is not what you see — it is what you make others feel."
                <footer className="text-xs mt-2 text-muted-foreground not-italic font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>— Tasmiya Fathima</footer>
              </blockquote>
              <Link href="/about">
                <motion.button
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm tracking-wide hover:bg-accent transition-colors font-body"
                  whileHover={{ scale: 1.04 }}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Read Full Story
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="py-20 bg-foreground/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold font-body block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Browse By Theme</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Collections</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} {...fadeUp(i * 0.08)}>
                <Link href={`/gallery?category=${cat.slug}`}>
                  <motion.div
                    className="relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer group"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <span className="text-white/90 text-sm font-heading" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{cat.name}</span>
                    </div>
                    {/* Placeholder pattern */}
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `hsl(${36 + i * 15} 20% 85%)` }}>
                      <span className="text-4xl opacity-30">{cat.emoji || "🎨"}</span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold font-body block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Fresh From The Studio</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>New Arrivals</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((artwork, i) => (
            <motion.div key={artwork.id} {...fadeUp(i * 0.08)}>
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-foreground/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold font-body block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Voices of Collectors</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Testimonials</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                {...fadeUp(i * 0.12)}
                className="glassmorphism p-8 rounded-3xl relative"
              >
                <Quote size={32} className="text-accent/30 mb-4" />
                <p className="text-foreground/80 leading-relaxed mb-6 font-body italic" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}>{t.content}</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-accent fill-accent" />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{t.author}</div>
                  <div className="text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp()}>
            <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold font-body block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Stay Inspired</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Join the Circle</h2>
            <p className="text-muted-foreground mb-8 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Receive exclusive updates on new artworks, exhibitions, and studio stories.
            </p>
            {subscribed ? (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-accent font-heading text-xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ✦ Welcome to Bayt Al Fann ✦
              </motion.p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-5 py-3 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm tracking-wide hover:bg-accent transition-colors font-body"
                  whileHover={{ scale: 1.04 }}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Subscribe
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Commission CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
          style={{ background: "linear-gradient(135deg, hsl(26 30% 33%) 0%, hsl(18 24% 19%) 100%)" }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 3 L37 20 L20 37 L3 20 Z M20 10 L30 20 L20 30 L10 20 Z" fill="none" stroke="hsl(46 68% 47%)" strokeWidth="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
          <div className="relative z-10">
            <span className="text-xs tracking-[0.4em] uppercase text-accent/80 font-body block mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Bespoke Artworks</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-light text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Commission Your <em>Masterpiece</em>
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Work directly with Tasmiya to create a unique piece tailored to your space, vision, and soul.
            </p>
            <Link href="/commission">
              <motion.button
                className="px-8 py-4 bg-accent text-white rounded-full text-sm tracking-widest uppercase font-semibold hover:bg-accent/90 transition-colors shadow-lg font-body"
                whileHover={{ scale: 1.04, y: -2 }}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Start Your Commission
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
