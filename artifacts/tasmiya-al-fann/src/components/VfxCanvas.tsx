import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; color: string; type: "dust" | "paint";
}

const COLORS = ["rgba(201,162,39,", "rgba(107,79,58,", "rgba(59,43,36,", "rgba(248,245,240,"];

export function VfxCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed floating particles
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push(createParticle(canvas.width, canvas.height, "dust"));
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Spawn paint particles on move
      if (Math.random() > 0.7) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 4 + 2,
          alpha: 0.7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          type: "paint",
        });
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spotlight glow around mouse
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      if (mx > 0) {
        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        gradient.addColorStop(0, "rgba(201,162,39,0.06)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw & update particles
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.01);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.008; // gentle gravity for dust
        if (p.type === "paint") { p.alpha -= 0.012; p.size *= 0.98; }
        else {
          p.alpha += Math.sin(Date.now() * 0.001 + p.x) * 0.002;
          p.alpha = Math.max(0.05, Math.min(0.25, p.alpha));
          if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
        }
      }

      // Keep dust population stable
      while (particlesRef.current.filter(p => p.type === "dust").length < 60) {
        particlesRef.current.push(createParticle(canvas.width, canvas.height, "dust"));
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

function createParticle(w: number, h: number, type: "dust" | "paint"): Particle {
  return {
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4 - 0.1,
    size: Math.random() * 2.5 + 0.5,
    alpha: Math.random() * 0.15 + 0.05,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    type,
  };
}
