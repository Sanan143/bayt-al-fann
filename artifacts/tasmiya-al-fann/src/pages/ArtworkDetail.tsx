import { useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShoppingBag, Heart, Share2, MessageCircle, ArrowLeft, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useArtworksStore } from "@/store/artworks";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { ArtworkCard } from "@/components/ArtworkCard";

export default function ArtworkDetail() {
  const [, params] = useRoute("/artwork/:id");
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { artworks } = useArtworksStore();

  const artwork = artworks.find(a => a.id === params?.id);
  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
        <h2 className="font-heading text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Artwork not found</h2>
        <Link href="/gallery"><button className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Back to Gallery</button></Link>
      </div>
    );
  }

  const images = [artwork.image, artwork.image, artwork.image]; // Placeholder multi-image
  const related = artworks.filter(a => a.category === artwork.category && a.id !== artwork.id).slice(0, 4);
  const inWishlist = isInWishlist(artwork.id);

  const certNumber = `BAF-${artwork.id.toUpperCase()}-2024`;

  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/gallery">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <ArrowLeft size={16} /> Back to Gallery
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image section */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden bg-muted mb-4 group">
              <img src={images[activeImg]} alt={artwork.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glassmorphism flex items-center justify-center hover:scale-110 transition-transform">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveImg(i => (i + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glassmorphism flex items-center justify-center hover:scale-110 transition-transform">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-accent" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="flex flex-col justify-between">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-accent mb-2 block font-body" style={{ fontFamily: "'Cinzel', serif" }}>{artwork.category}</span>
              <h1 className="font-heading text-4xl sm:text-5xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{artwork.title}</h1>
              <p className="text-muted-foreground text-sm mb-6 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>by {artwork.artist} · {artwork.year}</p>

              <p className="text-foreground/80 leading-relaxed mb-8 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{artwork.description}</p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Dimensions", value: `${artwork.width} × ${artwork.height} cm` },
                  { label: "Medium", value: artwork.medium },
                  { label: "Year", value: artwork.year.toString() },
                  { label: "Availability", value: artwork.available ? "Available" : "Sold" },
                ].map(({ label, value }) => (
                  <div key={label} className="glassmorphism p-3 rounded-xl">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</div>
                    <div className={`text-sm font-medium font-body ${label === "Availability" && !artwork.available ? "text-destructive" : label === "Availability" ? "text-green-600" : "text-foreground"}`} style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Certificate of Authenticity */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 mb-8">
                <Award size={20} className="text-accent flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-accent font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Certificate of Authenticity</div>
                  <div className="text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Each artwork ships with a signed certificate. Ref: {certNumber}</div>
                </div>
              </div>
            </div>

            {/* Price + Actions */}
            <div>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-heading text-4xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>${artwork.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>USD · Free shipping</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {artwork.available ? (
                  <>
                    <motion.button
                      onClick={() => addItem({ id: artwork.id, title: artwork.title, price: artwork.price, image: artwork.image, quantity: 1 })}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-accent transition-colors font-body"
                      whileHover={{ scale: 1.02 }} style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <ShoppingBag size={16} /> Add to Cart
                    </motion.button>
                    <a href={`https://wa.me/+919999999999?text=Hi! I'm interested in "${artwork.title}" (${artwork.id})`} target="_blank" rel="noopener noreferrer">
                      <motion.button className="flex items-center justify-center gap-2 px-5 py-4 border border-primary/40 rounded-full text-sm text-primary hover:border-accent hover:text-accent transition-colors w-full sm:w-auto font-body" whileHover={{ scale: 1.02 }} style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <MessageCircle size={16} /> WhatsApp
                      </motion.button>
                    </a>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm font-body rounded-full border border-border" style={{ fontFamily: "'Poppins', sans-serif" }}>This artwork has been sold</div>
                )}
                <button onClick={() => toggleItem({ id: artwork.id, title: artwork.title, price: artwork.price, image: artwork.image })}
                  className={`p-4 rounded-full border transition-all ${inWishlist ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-accent"}`}>
                  <Heart size={18} className={inWishlist ? "fill-accent" : ""} />
                </button>
                <button className="p-4 rounded-full border border-border hover:border-primary transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Story */}
        <section className="max-w-3xl mx-auto mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Story Behind</h2>
            <p className="text-muted-foreground leading-relaxed text-center font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{artwork.story}</p>
          </motion.div>
        </section>

        {/* Related Artworks */}
        {related.length > 0 && (
          <section>
            <h2 className="font-heading text-3xl mb-8 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ArtworkCard artwork={a} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
