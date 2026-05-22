import { Link } from "wouter";
import { Artwork } from "@/data/artworks";
import { useWishlistStore } from "@/store/wishlist";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const { hasItem, toggleItem } = useWishlistStore();
  const isWishlisted = hasItem(artwork.id);

  return (
    <motion.div 
      className="group relative flex flex-col cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative overflow-hidden rounded-md bg-muted mb-4 aspect-[3/4]">
        <Link href={`/artwork/${artwork.id}`}>
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <button
          data-testid={`button-wishlist-${artwork.id}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem(artwork.id);
          }}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted ? 'bg-primary/20 text-primary' : 'bg-background/20 text-foreground hover:bg-background/40'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-primary' : ''}`} />
        </button>
        {!artwork.available && (
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider font-medium">
            Sold
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-start">
          <Link href={`/artwork/${artwork.id}`}>
            <h3 className="font-heading text-xl md:text-2xl text-foreground font-medium group-hover:text-primary transition-colors">
              {artwork.title}
            </h3>
          </Link>
          <span className="font-body text-sm text-muted-foreground mt-1">${artwork.price}</span>
        </div>
        <p className="font-body text-sm text-muted-foreground">{artwork.medium}</p>
        <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mt-2">{artwork.category}</p>
      </div>
    </motion.div>
  );
}
