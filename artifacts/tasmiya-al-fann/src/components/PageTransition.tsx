import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  /** Optional key to re-trigger animation when route changes */
  routeKey?: string;
}

/**
 * PageTransition — wraps page-level content in a subtle fade + slight-up
 * entrance animation. Keeps animations brief to avoid feeling sluggish.
 * Respects prefers-reduced-motion via the CSS variable system.
 */
export function PageTransition({ children, routeKey }: PageTransitionProps) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      }}
      // Inline style fallback for users with reduced motion
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
