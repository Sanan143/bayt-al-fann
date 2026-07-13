import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useArtworksStore } from "@/store/artworks";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/store/auth";

const SORT_OPTIONS = ["Default", "Price: Low to High", "Price: High to Low", "Newest"];

export default function Shop() {
  const [sort, setSort] = useState("Default");
  const [filter, setFilter] = useState("All");
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { artworks } = useArtworksStore();
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const handleAddToCart = (artwork: any) => {
    if (!user) {
      setLocation(`/auth?redirect=${encodeURIComponent(location)}`);
    } else {
      addItem({ id: artwork.id, title: artwork.title, price: artwork.price, image: artwork.image, quantity: 1 });
    }
  };

  const sorted = useMemo(() => {
    let list = filter === "Available" ? artworks.filter(a => a.available) : filter === "Sold" ? artworks.filter(a => !a.available) : [...artworks];
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    else if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    else if (sort === "Newest") list.sort((a, b) => b.year - a.year);
    return list;
  }, [sort, filter, artworks]);

  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Acquire Original Art</span>
          <h1 className="font-heading text-5xl sm:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Shop</h1>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {["All", "Available", "Sold"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full border text-sm font-body transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}>{f}</button>
          ))}
          <div className="ml-auto">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2 border border-border rounded-full text-sm bg-card focus:outline-none focus:ring-2 focus:ring-accent/40 font-body"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sorted.map((artwork, i) => {
            const inWishlist = isInWishlist(artwork.id);
            return (
              <motion.div key={artwork.id} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className="relative overflow-hidden bg-muted" style={{ paddingBottom: "120%" }}>
                  <div className="absolute inset-0">
                    <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                    <Link href={`/artwork/${artwork.id}`}>
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Eye size={16} className="text-white" />
                      </button>
                    </Link>
                    {artwork.available && (
                      <button onClick={() => handleAddToCart(artwork)}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                        <ShoppingBag size={16} className="text-white" />
                      </button>
                    )}
                  </div>
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                    {!artwork.available && <span className="text-[9px] px-2 py-0.5 rounded-full bg-foreground/80 text-background font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>SOLD</span>}
                    {artwork.isFeatured && <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent text-white font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>FEATURED</span>}
                  </div>
                  {/* Wishlist */}
                  <button onClick={() => toggleItem({ id: artwork.id, title: artwork.title, price: artwork.price, image: artwork.image })}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full glassmorphism flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                    <Heart size={13} className={inWishlist ? "text-accent fill-accent" : "text-foreground"} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[9px] tracking-widest uppercase text-muted-foreground mb-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{artwork.category}</p>
                  <h3 className="font-heading text-base leading-snug mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{artwork.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-primary" style={{ fontFamily: "'Cormorant Garamond', serif" }}>₹{artwork.price.toLocaleString()}</span>
                    {artwork.available && (
                      <button onClick={() => handleAddToCart(artwork)}
                        className="text-[10px] px-2.5 py-1 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-body"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
