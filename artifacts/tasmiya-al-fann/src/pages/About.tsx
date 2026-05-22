import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <h1 className="font-heading text-5xl md:text-7xl mb-8 leading-tight">
              A pursuit of <br/><span className="text-primary italic">quiet elegance.</span>
            </h1>
            <div className="space-y-6 font-body font-light text-lg text-muted-foreground leading-relaxed">
              <p>
                Tasmiya Fathima is an artist driven by a singular vision: to capture the stillness often lost in our modern world. Her work is deeply rooted in the traditions of Islamic geometry and Arabic calligraphy, reimagined through a lens of modern editorial minimalism.
              </p>
              <p>
                Operating from her sun-lit studio, she works primarily with natural pigments, plaster, and gold leaf on canvas and parchment. The resulting textures invite touch, while the compositions invite reflection.
              </p>
              <p>
                "I want my paintings to feel like a deep breath. A place where the eye can rest, and the mind can follow," she explains.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 translate-x-4 translate-y-4 rounded-sm" />
            <img 
              src="/images/portrait.png" 
              alt="Tasmiya Fathima Portrait" 
              className="relative z-10 w-full h-auto object-cover aspect-[4/5] rounded-sm shadow-xl grayscale-[10%]"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-y border-border/50 text-center mb-32">
          <div className="flex flex-col">
            <span className="font-heading text-5xl text-primary mb-2">50+</span>
            <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">Original Works</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-5xl text-primary mb-2">200+</span>
            <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">Global Collectors</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-5xl text-primary mb-2">5+</span>
            <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">Years Exhibiting</span>
          </div>
        </div>

      </div>
    </div>
  );
}
