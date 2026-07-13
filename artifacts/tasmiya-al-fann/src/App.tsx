import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VfxCanvas } from "@/components/VfxCanvas";
import { CartDrawer } from "@/components/CartDrawer";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import ArtworkDetail from "@/pages/ArtworkDetail";
import About from "@/pages/About";
import Commission from "@/pages/Commission";
import Blog from "@/pages/Blog";
import OrderHistory from "@/pages/OrderHistory";
import Contact from "@/pages/Contact";
import Shop from "@/pages/Shop";
import Faq from "@/pages/Faq";
import Admin from "@/pages/Admin";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient();

function AppLayout() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <>
      <VfxCanvas />
      <Navbar />
      <CartDrawer />
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
