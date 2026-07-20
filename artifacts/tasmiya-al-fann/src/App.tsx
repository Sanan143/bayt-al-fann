import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VfxCanvas } from "@/components/VfxCanvas";
import { CartDrawer } from "@/components/CartDrawer";

// ── Lazy-loaded pages ────────────────────────────────────────────────────────
// Each page is split into its own chunk and loaded only when first visited.
// This reduces the initial bundle size and improves LCP/FID.
const Home         = lazy(() => import("@/pages/Home"));
const Gallery      = lazy(() => import("@/pages/Gallery"));
const ArtworkDetail= lazy(() => import("@/pages/ArtworkDetail"));
const About        = lazy(() => import("@/pages/About"));
const Commission   = lazy(() => import("@/pages/Commission"));
const Blog         = lazy(() => import("@/pages/Blog"));
const OrderHistory = lazy(() => import("@/pages/OrderHistory"));
const Contact      = lazy(() => import("@/pages/Contact"));
const Shop         = lazy(() => import("@/pages/Shop"));
const Faq          = lazy(() => import("@/pages/Faq"));
const Auth         = lazy(() => import("@/pages/Auth"));
const Checkout     = lazy(() => import("@/pages/Checkout"));
const Profile      = lazy(() => import("@/pages/Profile"));
const Admin        = lazy(() => import("@/pages/Admin"));
const NotFound     = lazy(() => import("@/pages/not-found"));

// ── QueryClient ───────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time of 5 minutes — reduces unnecessary refetches
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// ── Page loading fallback ─────────────────────────────────────────────────────
function PageSuspense() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center"
      role="status"
      aria-label="Loading page..."
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated arabesque spinner */}
        <svg
          className="w-12 h-12 animate-spin text-accent"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          <path
            d="M12 2 A10 10 0 0 1 22 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span
          className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          بيت الفن
        </span>
      </div>
    </div>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <Suspense fallback={<PageSuspense />}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <>
      <VfxCanvas />
      <Navbar />
      <CartDrawer />
      {/* id="main-content" is targeted by the skip-to-content link in index.html */}
      <main id="main-content">
        <Suspense fallback={<PageSuspense />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/artwork/:id" component={ArtworkDetail} />
            <Route path="/about" component={About} />
            <Route path="/commission" component={Commission} />
            <Route path="/blog" component={Blog} />
            <Route path="/order-history" component={OrderHistory} />
            <Route path="/contact" component={Contact} />
            <Route path="/shop" component={Shop} />
            <Route path="/faq" component={Faq} />
            <Route path="/auth" component={Auth} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppLayout />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

