import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BrushStroke } from "./svgs/BrushStroke";
import { FloatingParticles } from "./svgs/FloatingParticles";
import { Button } from "./ui/button";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      gsap.to(imageRef.current, {
        x: x * 2,
        y: y * 2,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  const headingText = "Tasmiya Al-Fann".split("");

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-background selection:bg-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_60%)] opacity-5 pointer-events-none" />
      <FloatingParticles className="z-0" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start pt-12 lg:pt-0">
          <div className="relative mb-6">
            <BrushStroke className="absolute -inset-x-8 -inset-y-4 w-[120%] h-[150%] text-primary/10 -z-10" />
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-foreground leading-[1.1]">
              {headingText.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: [0.2, 0.65, 0.3, 0.9],
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="font-body text-xl md:text-2xl text-muted-foreground font-light mb-12 max-w-lg"
          >
            Where colors become stories.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link href="/gallery">
              <Button size="lg" className="w-full sm:w-auto rounded-none font-heading text-lg px-8 h-14 tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                Explore Collection
              </Button>
            </Link>
            <Link href="/commission">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-none font-heading text-lg px-8 h-14 tracking-wide border-primary text-primary hover:bg-primary/5 transition-all">
                Commission Artwork
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="relative h-[60vh] lg:h-[80vh] w-full hidden md:block"
        >
          <div className="absolute inset-0 bg-primary/5 -rotate-3 rounded-lg transform-gpu" />
          <img 
            ref={imageRef}
            src="/images/artwork-1.png" 
            alt="Tasmiya Al-Fann Abstract Artwork" 
            className="absolute inset-0 w-full h-full object-cover rounded-sm shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
