import { Hero } from "@/components/Hero";
import { WaveDivider } from "@/components/svgs/WaveDivider";
import { ArtworkCard } from "@/components/ArtworkCard";
import { artworks } from "@/data/artworks";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const featuredArtworks = artworks.filter(a => a.featured).slice(0, 3);
  const categories = ["Abstract", "Islamic Art", "Portraits", "Calligraphy", "Modern Art"];

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />
      <WaveDivider className="text-muted w-full" />
      
      {/* Featured Collection */}
      <section className="py-24 px-6 lg:px-12 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl mb-4">Selected Works</h2>
            <p className="font-body text-muted-foreground font-light max-w-lg">
              A curated selection of recent pieces, highlighting the interplay of texture, light, and geometry.
            </p>
          </div>
          <Link href="/gallery">
            <Button variant="outline" className="rounded-none font-heading tracking-widest text-primary border-primary hover:bg-primary/5 uppercase text-xs">
              View All Artwork
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {featuredArtworks.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-muted py-32 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] relative rounded-md overflow-hidden"
          >
            <img src="/images/portrait.png" alt="Tasmiya Fathima in Studio" className="object-cover w-full h-full grayscale-[20%] sepia-[10%]" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-start"
          >
            <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">The Artist</span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              Creating spaces of quiet contemplation.
            </h2>
            <p className="font-body font-light text-muted-foreground text-lg mb-10 leading-relaxed">
              Based in her sun-drenched studio, Tasmiya's work explores the delicate balance between modern minimalism and ancient Islamic geometries. Each piece is an invitation to slow down, to observe the interplay of shadow and warmth, and to find beauty in intentional restraint.
            </p>
            <Link href="/about">
              <Button className="rounded-none font-heading tracking-widest bg-foreground text-background hover:bg-foreground/90 uppercase text-xs px-8 h-12">
                Read the Full Story
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quote / Testimonial */}
      <section className="py-40 px-6 container mx-auto text-center relative">
        <div className="max-w-4xl mx-auto">
          <span className="text-primary text-6xl font-serif leading-none block mb-4 opacity-50">"</span>
          <h3 className="font-heading text-3xl md:text-5xl leading-tight mb-8">
            Art is not simply created; it is felt. It is the silent language between the soul and the canvas.
          </h3>
          <p className="font-body text-muted-foreground uppercase tracking-widest text-sm">— Tasmiya Fathima</p>
        </div>
      </section>

    </main>
  );
}
