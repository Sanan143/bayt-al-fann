import { Link } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Mail, MessageCircle, ArrowUp } from "lucide-react";

const LINKS = {
  Explore: [
    { href: "/gallery", label: "Gallery" },
    { href: "/shop", label: "Shop" },
    { href: "/order-history", label: "Order History" },
    { href: "/blog", label: "Blog" },
    { href: "/commission", label: "Commission" },
  ],
  Info: [
    { href: "/about", label: "About the Artist" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/admin", label: "Admin Portal" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-foreground text-background pt-16 pb-32 lg:pb-16 relative overflow-hidden mt-24">
      {/* Decorative arabesque */}
      <svg className="absolute top-0 left-0 right-0 w-full opacity-5" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 Q180,0 360,20 Q540,40 720,20 Q900,0 1080,20 Q1260,40 1440,20" stroke="hsl(46 68% 47%)" strokeWidth="1.5" fill="none" />
      </svg>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="block text-xs tracking-[0.4em] uppercase text-accent/70 font-body" style={{ fontFamily: "'Cinzel', serif" }}>بيت الفن</span>
              <h3 className="font-heading text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Bayt Al Fann</h3>
            </div>
            <p className="text-background/60 text-sm leading-relaxed max-w-xs mb-6 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
              A digital sanctuary where Islamic art, Arabic geometry, and contemporary minimalism converge into timeless beauty.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/+919999999999" target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-background/20 hover:border-accent hover:text-accent transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href="mailto:tasmiya@baytafann.com"
                className="p-2.5 rounded-full border border-background/20 hover:border-accent hover:text-accent transition-colors">
                <Mail size={16} />
              </a>
              <a href="https://www.instagram.com/crafter_chaos?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-background/20 hover:border-accent hover:text-accent transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs tracking-widest uppercase text-accent mb-5 font-body" style={{ fontFamily: "'Cinzel', serif" }}>{group}</h4>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>
                      <span className="text-sm text-background/60 hover:text-background transition-colors cursor-pointer font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
            © {new Date().getFullYear()} Bayt Al Fann · Tasmiya Fathima Azeez. All rights reserved.
          </p>
          <motion.button
            onClick={scrollTop}
            className="flex items-center gap-2 text-xs text-background/40 hover:text-accent transition-colors font-body"
            whileHover={{ y: -2 }}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Back to top <ArrowUp size={12} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
