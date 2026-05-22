import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { artworks, ArtworkCategory } from "@/data/artworks";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<ArtworkCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const categories = ["All", "Abstract", "Islamic Art", "Portraits", "Calligraphy", "Modern Art"];

  const filteredArtworks = useMemo(() => {
    return artworks
      .filter(art => activeCategory === "All" || art.category === activeCategory)
      .filter(art => 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        if (sortOption === "popular") return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        // newest
        return b.year - a.year;
      });
  }, [activeCategory, searchQuery, sortOption]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl md:text-6xl mb-6">The Collection</h1>
          <p className="font-body font-light text-muted-foreground max-w-2xl mx-auto">
            Explore original pieces across abstract, calligraphy, and modern minimalism. Each artwork is a unique expression of light and form.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 border-b border-border/50 pb-8">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as ArtworkCategory | "All")}
                className={`font-heading text-lg transition-colors px-2 pb-1 border-b-2 ${
                  activeCategory === cat ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search artwork..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 font-body rounded-none border-border focus-visible:ring-primary bg-transparent"
              />
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px] rounded-none font-body bg-transparent">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Masonry Grid Simulation */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence>
            {filteredArtworks.map((artwork, idx) => (
              <div key={artwork.id} className="break-inside-avoid">
                <ArtworkCard artwork={artwork} />
              </div>
            ))}
          </AnimatePresence>
        </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-32 text-muted-foreground font-body">
            No artworks found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
