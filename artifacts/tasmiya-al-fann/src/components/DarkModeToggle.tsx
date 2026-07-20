import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * DarkModeToggle — persists preference in localStorage and applies
 * the .dark class to <html> to activate the project's dark theme tokens.
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Initialise from localStorage, then fall back to system preference
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("bayt-al-fann-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply / remove the .dark class on <html> whenever isDark changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("bayt-al-fann-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("bayt-al-fann-theme", "light");
    }
  }, [isDark]);

  return (
    <motion.button
      onClick={() => setIsDark((v) => !v)}
      className="relative p-2.5 rounded-full hover:bg-primary/10 transition-colors text-foreground/70 hover:text-foreground"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
          >
            <Sun size={18} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
          >
            <Moon size={18} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
