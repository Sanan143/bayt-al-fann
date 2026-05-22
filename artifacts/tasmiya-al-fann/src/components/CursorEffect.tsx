import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

export function CursorEffect() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isTypingTasmiya, setIsTypingTasmiya] = useState(false);

  useEffect(() => {
    const updateMousePos = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePos);

    return () => {
      window.removeEventListener('mousemove', updateMousePos);
    };
  }, []);

  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      const newParticle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        color: ['#B8860B', '#CD853F', '#DAA520', '#F5DEB3'][Math.floor(Math.random() * 4)]
      };
      setParticles(p => [...p.slice(-4), newParticle]);
      
      setTimeout(() => {
        setParticles(p => p.filter(part => part.id !== newParticle.id));
      }, 1000);
    };

    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, []);

  useEffect(() => {
    let typed = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      typed += e.key.toLowerCase();
      if (typed.length > 7) {
        typed = typed.slice(-7);
      }
      if (typed === 'tasmiya') {
        setIsTypingTasmiya(true);
        setTimeout(() => setIsTypingTasmiya(false), 3000);
        typed = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-primary pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.5
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[10000] hidden md:block"
        animate={{
          x: mousePos.x - 3,
          y: mousePos.y - 3,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 25,
          mass: 0.1
        }}
      />
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
            style={{ 
              x: p.x - 16, 
              y: p.y - 16,
              border: `2px solid ${p.color}`
            }}
          />
        ))}
      </AnimatePresence>
      {isTypingTasmiya && (
         <div className="fixed inset-0 pointer-events-none z-[10000] flex items-center justify-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1.2, rotate: [0, 5, -5, 0] }}
               exit={{ opacity: 0 }}
               className="text-6xl font-heading text-primary font-bold drop-shadow-lg"
            >
               Tasmiya
            </motion.div>
         </div>
      )}
    </>
  );
}
