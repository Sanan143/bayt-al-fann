import { useParams, Link } from "wouter";
import { artworks } from "@/data/artworks";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, Check } from "lucide-react";
import NotFound from "./not-found";

export default function ArtworkDetail() {
  const { id } = useParams();
  const artwork = artworks.find(a => a.id === id);
  const { addItem, setIsOpen } = useCartStore();
  const { hasItem, toggleItem } = useWishlistStore();

  if (!artwork) return <NotFound />;

  const isWishlisted = hasItem(artwork.id);
  const relatedArtworks = artworks.filter(a => a.category === artwork.category && a.id !== artwork.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-6 lg:px-12">
        <Link href="/gallery" className="inline-flex items-center text-sm font-body uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Gallery
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-32">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden bg-muted p-4 sm:p-8 lg:p-12">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-full object-contain shadow-2xl transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl">{artwork.title}</h1>
              <button 
                onClick={() => toggleItem(artwork.id)}
                className={`p-3 rounded-full border transition-colors ${
                  isWishlisted ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-primary' : ''}`} />
              </button>
            </div>
            
            <p className="font-heading text-2xl text-muted-foreground mb-8">${artwork.price}</p>
            
            <div className="h-px w-full bg-border/50 mb-8" />
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 font-body text-sm mb-12">
              <div>
                <span className="text-muted-foreground block mb-1">Artist</span>
                <span className="text-foreground">{artwork.artist}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Category</span>
                <span className="text-foreground">{artwork.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Medium</span>
                <span className="text-foreground">{artwork.medium}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Dimensions</span>
                <span className="text-foreground">{artwork.width} × {artwork.height} cm</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Year</span>
                <span className="text-foreground">{artwork.year}</span>
              </div>
            </div>

            <p className="font-body font-light text-foreground/80 leading-relaxed mb-12 text-lg">
              {artwork.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              {artwork.available ? (
                <>
                  <Button 
                    className="flex-1 rounded-none font-heading text-lg h-14 bg-foreground text-background hover:bg-foreground/90"
                    onClick={() => {
                      addItem(artwork);
                      setIsOpen(true);
                    }}
                  >
                    Add to Cart
                  </Button>
                </>
              ) : (
                <Button disabled className="flex-1 rounded-none font-heading text-lg h-14 bg-muted text-muted-foreground">
                  Sold Out
                </Button>
              )}
            </div>

            <div className="bg-card p-8 border border-card-border">
              <h3 className="font-heading text-2xl mb-4 text-primary">The Story</h3>
              <p className="font-body font-light text-muted-foreground italic leading-relaxed">
                "{artwork.story}"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="border-t border-border pt-24">
            <h2 className="font-heading text-3xl mb-12">More from {artwork.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {relatedArtworks.map((relatedArtwork) => (
                <Link key={relatedArtwork.id} href={`/artwork/${relatedArtwork.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] overflow-hidden bg-muted mb-4">
                      <img 
                        src={relatedArtwork.image} 
                        alt={relatedArtwork.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-heading text-xl group-hover:text-primary transition-colors">{relatedArtwork.title}</h4>
                    <p className="font-body text-sm text-muted-foreground mt-1">${relatedArtwork.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
