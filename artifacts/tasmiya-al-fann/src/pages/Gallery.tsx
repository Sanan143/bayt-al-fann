import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/store/auth";
import { Search, Filter, X, ZoomIn } from "lucide-react";
import { useArtworksStore } from "@/store/artworks";
import type { ArtworkCategory } from "@/store/artworks";

import { useCart } from "@/store/cart";

const SORT_OPTIONS = ["Default", "Price: Low to High", "Price: High to Low", "Newest"];
const STATUS_OPTIONS = ["All", "Available", "Sold"];

export default function Gallery() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Default");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();
  const { artworks, categories } = useArtworksStore();
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const handleAddToCart = (artwork: any) => {
    if (!user) {
      setLocation(`/auth?redirect=${encodeURIComponent(location)}`);
    } else {
      addItem({ id: artwork.id, title: artwork.title, price: artwork.price, image: artwork.image, quantity: 1 });
    }
  };

  const filtered = useMemo(() => {
    let list = [...artworks];
    if (search) list = list.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.includes(search.toLowerCase())));
    if (selectedCategory !== "All") list = list.filter(a => a.category === selectedCategory);
    if (selectedStatus === "Available") list = list.filter(a => a.available);
    if (selectedStatus === "Sold") list = list.filter(a => !a.available);
    if (sortBy === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    if (sortBy === "Newest") list.sort((a, b) => b.year - a.year);
    return list;
  }, [search, selectedCategory, selectedStatus, sortBy, artworks]);

  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-8">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-2" style={{ fontFamily: "'Cinzel', serif" }}>The Collection</span>
          <h1 className="font-heading text-5xl sm:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Gallery</h1>
          <p className="text-muted-foreground mt-3 font-body text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{filtered.length} works</p>
        </motion.div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search artworks, styles, tags..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>
          <button onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 px-5 py-3 border border-border rounded-full text-sm hover:border-accent transition-colors font-body"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Filter size={15} /> Filters
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-4 py-3 border border-border rounded-full text-sm bg-card focus:outline-none focus:ring-2 focus:ring-accent/40 font-body"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="pt-4 flex flex-wrap gap-3">
                {/* Category chips */}
                {["All", ...categories.map(c => c.name)].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all font-body ${selectedCategory === cat ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {cat}
                  </button>
                ))}
                <div className="w-px bg-border mx-1" />
                {/* Status chips */}
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => setSelectedStatus(s)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all font-body ${selectedStatus === s ? "bg-accent text-white border-accent" : "border-border hover:border-accent"}`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>No artworks found.</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
            {filtered.map((artwork, i) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl bg-card border border-border/50 cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ paddingBottom: `${65 + (i % 3) * 20}%` }}>
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <div className="w-full h-full" style={{ background: `hsl(${30 + i * 18} 20% 82%)` }}>
                      <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                    <button onClick={() => setLightbox(artwork.image)}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                      <ZoomIn size={16} className="text-white" />
                    </button>
                    <Link href={`/artwork/${artwork.id}`}>
                      <button className="px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-xs tracking-wide hover:bg-white/30 transition-colors font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        View
                      </button>
                    </Link>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                    {!artwork.available && <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/80 text-background font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Sold</span>}
                    {artwork.isFeatured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-white font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Featured</span>}
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{artwork.category}</p>
                  <h3 className="font-heading text-lg leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{artwork.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-primary text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>₹{artwork.price.toLocaleString()}</span>
                    {artwork.available && (
                      <button
                        onClick={() => handleAddToCart(artwork)}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-body"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X size={20} className="text-white" />
            </button>
            <motion.img src={lightbox} alt="Artwork fullscreen" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
