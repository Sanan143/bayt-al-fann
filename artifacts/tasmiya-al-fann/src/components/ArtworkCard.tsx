import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, ShoppingBag } from "lucide-react";
import type { Artwork } from "@/data/artworks";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

interface Props { artwork: Artwork; }

export function ArtworkCard({ artwork }: Props) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(artwork.id);

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Image */}
      <Link href={`/artwork/${artwork.id}`}>
        <div className="relative overflow-hidden bg-muted" style={{ paddingBottom: "120%" }}>
          <div className="absolute inset-0">
            <div className="w-full h-full" style={{ background: `hsl(${30 + artwork.id.length * 15} 18% 82%)` }}>
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
              />
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {!artwork.available && (
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-foreground/80 text-background font-body font-medium"
                style={{ fontFamily: "'Poppins', sans-serif" }}>SOLD</span>
            )}
            {artwork.isFeatured && (
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-accent text-white font-body font-medium"
                style={{ fontFamily: "'Poppins', sans-serif" }}>FEATURED</span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); toggleItem({ id: artwork.id, title: artwork.title, price: artwork.price, image: artwork.image }); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full glassmorphism flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <Heart size={13} className={inWishlist ? "text-accent fill-accent" : "text-foreground"} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[9px] tracking-widest uppercase text-muted-foreground mb-1 font-body"
          style={{ fontFamily: "'Poppins', sans-serif" }}>{artwork.category}</p>
        <Link href={`/artwork/${artwork.id}`}>
          <h3 className="font-heading text-lg leading-snug mb-1 hover:text-accent transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>{artwork.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3 font-body line-clamp-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}>{artwork.medium}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading text-xl text-foreground"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>${artwork.price.toLocaleString()}</span>
          {artwork.available ? (
            <motion.button
              onClick={() => addItem({ id: artwork.id, title: artwork.title, price: artwork.price, image: artwork.image, quantity: 1 })}
              className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-body font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <ShoppingBag size={11} /> Add to Cart
            </motion.button>
          ) : (
            <span className="text-[10px] text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Sold</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
