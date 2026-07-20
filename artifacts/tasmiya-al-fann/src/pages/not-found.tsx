import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, LayoutGrid, ArrowLeft } from "lucide-react";

/**
 * 404 Not Found — Bayt Al Fann branded page.
 * Features animated Arabic "٤٠٤" numerals, arabesque SVG pattern,
 * and smooth framer-motion entrance animations.
 */
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background"
      aria-labelledby="not-found-title"
    >
      {/* ── Arabesque Background Pattern ─────────────────────────────── */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="arabesque-404" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M40 5 L75 40 L40 75 L5 40 Z M40 18 L62 40 L40 62 L18 40 Z M40 30 L50 40 L40 50 L30 40 Z"
                fill="none"
                stroke="hsl(46 68% 47%)"
                strokeWidth="0.8"
              />
              <circle cx="40" cy="40" r="3" fill="none" stroke="hsl(46 68% 47%)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arabesque-404)" />
        </svg>
      </div>

      {/* ── Gold Radial Glow ──────────────────────────────────────────── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, hsl(46 68% 47% / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-xl">

        {/* Arabic/Latin blended numeral */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="mb-6"
          aria-hidden="true"
        >
          {/* Arabic numerals overlay */}
          <div className="relative inline-block">
            <span
              className="block text-[10rem] sm:text-[14rem] leading-none font-heading select-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                background: "linear-gradient(135deg, hsl(46 68% 47%), hsl(26 30% 33%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </span>
            {/* Floating Arabic numerals */}
            <motion.span
              className="absolute -top-4 -right-8 text-4xl sm:text-5xl opacity-30 text-accent"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ٤٠٤
            </motion.span>
          </div>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-8"
          aria-hidden="true"
        >
          <div className="h-px bg-gradient-to-r from-transparent to-accent/40 w-16" />
          <span className="text-accent text-lg">✦</span>
          <div className="h-px bg-gradient-to-l from-transparent to-accent/40 w-16" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          id="not-found-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading text-3xl sm:text-4xl font-light mb-4 text-foreground"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Page Not Found
        </motion.h1>

        {/* Arabic subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-accent/70 text-sm tracking-[0.3em] uppercase mb-4 font-body"
          style={{ fontFamily: "'Cinzel', serif" }}
          lang="ar"
          dir="rtl"
        >
          الصفحة غير موجودة
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-muted-foreground text-sm leading-relaxed mb-10 font-body"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          The page you're looking for has wandered beyond the gallery walls.
          <br />
          Let us guide you back to beauty.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <motion.button
              className="flex items-center gap-2.5 px-7 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold tracking-wide hover:bg-accent transition-colors font-body shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Home size={15} aria-hidden="true" />
              Return Home
            </motion.button>
          </Link>
          <Link href="/gallery">
            <motion.button
              className="flex items-center gap-2.5 px-7 py-3.5 border border-primary/40 text-primary rounded-full text-sm font-medium hover:bg-primary/5 transition-colors font-body"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <LayoutGrid size={15} aria-hidden="true" />
              Browse Gallery
            </motion.button>
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          onClick={() => window.history.back()}
          className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto font-body"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <ArrowLeft size={12} aria-hidden="true" />
          Go back to previous page
        </motion.button>
      </div>

      {/* ── Floating accent dots ──────────────────────────────────────── */}
      {[
        { top: "15%", left: "10%", delay: 0 },
        { top: "70%", left: "85%", delay: 1 },
        { top: "30%", left: "90%", delay: 2 },
        { top: "80%", left: "8%", delay: 1.5 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-accent/20"
          style={{ top: pos.top, left: pos.left }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: pos.delay }}
          aria-hidden="true"
        />
      ))}
    </main>
  );
}

