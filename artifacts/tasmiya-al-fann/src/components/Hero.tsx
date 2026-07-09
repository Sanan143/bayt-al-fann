import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowDown, Sparkles } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!titleRef.current) return;
    // Stagger reveal each word
    const words = titleRef.current.querySelectorAll(".word");
    gsap.from(words, {
      y: 80, opacity: 0, rotateX: -30,
      stagger: 0.12, duration: 1.1,
      ease: "power4.out", delay: 0.3,
    });
    if (subtitleRef.current) {
      gsap.from(subtitleRef.current, {
        y: 30, opacity: 0, duration: 0.9, ease: "power3.out", delay: 1.0,
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-20 pb-32 px-6">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 40%,
              hsl(46 68% 47% / 0.08) 0%,
              hsl(36 24% 96% / 0) 70%)`,
          }}
        />
        {/* Arabic geometric pattern overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="arabesque" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M30 5 L55 30 L30 55 L5 30 Z M30 15 L45 30 L30 45 L15 30 Z"
                fill="none" stroke="hsl(26 30% 33%)" strokeWidth="0.8"
              />
              <circle cx="30" cy="30" r="8" fill="none" stroke="hsl(46 68% 47%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arabesque)" />
        </svg>
      </div>

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-8 flex items-center gap-2"
      >
        <span className="w-8 h-px bg-accent" />
        <span
          className="text-xs tracking-[0.4em] uppercase text-accent font-semibold"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          بيت الفن · House of Art
        </span>
        <span className="w-8 h-px bg-accent" />
      </motion.div>

      {/* Main heading */}
      <h1
        ref={titleRef}
        className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-[0.9] mb-8 overflow-hidden"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <span className="block overflow-hidden">
          <span className="word inline-block">Bayt</span>
          {" "}
          <span className="word inline-block">Al Fann</span>
        </span>
        <span className="block overflow-hidden">
          <span className="word inline-block italic text-primary/60">The House</span>
        </span>
        <span className="block overflow-hidden">
          <span className="word inline-block">of Art</span>
        </span>
      </h1>

      {/* SVG decorative brush stroke */}
      <motion.svg
        viewBox="0 0 400 20"
        className="w-48 sm:w-72 mb-8 text-accent"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
      >
        <motion.path
          d="M10,10 Q100,2 200,10 Q300,18 390,10"
          stroke="currentColor" strokeWidth="1.5"
          fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 1.3 }}
        />
      </motion.svg>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed mb-12"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Where every canvas tells a sacred story — a fusion of Islamic geometry,
        Arabic calligraphy, and modern minimalism.
      </p>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <Link href="/gallery">
          <motion.button
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-widest uppercase font-semibold hover:bg-accent transition-colors shadow-lg"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Explore Gallery
          </motion.button>
        </Link>
        <Link href="/commission">
          <motion.button
            className="px-8 py-4 border border-primary/40 text-primary rounded-full text-sm tracking-widest uppercase hover:border-accent hover:text-accent transition-colors"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Commission a Piece
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="mt-16 grid grid-cols-3 gap-8 sm:gap-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        {[
          { value: "200+", label: "Artworks" },
          { value: "8+", label: "Years" },
          { value: "50+", label: "Exhibitions" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div
              className="text-3xl sm:text-4xl font-heading text-foreground"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {value}
            </div>
            <div
              className="text-xs tracking-widest uppercase text-muted-foreground mt-1"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-20 lg:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>Scroll</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
}
