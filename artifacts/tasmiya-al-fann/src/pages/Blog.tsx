import { motion } from "framer-motion";
import { Link } from "wouter";
import { Clock, ArrowRight } from "lucide-react";

const POSTS = [
  { id: "1", title: "The Sacred Mathematics of Islamic Geometry", excerpt: "How ancient Islamic artists used mathematics as a form of divine worship, creating infinite patterns from simple principles.", coverImage: "/images/artwork-2.png", author: "Tasmiya Fathima Azeez", readTime: "6 min read", date: "June 2025", category: "Insights" },
  { id: "2", title: "Choosing the Right Art for Your Space", excerpt: "A guide to selecting artwork that harmonizes with your interior, considering light, scale, and emotional resonance.", coverImage: "/images/artwork-1.png", author: "Tasmiya Fathima Azeez", readTime: "4 min read", date: "May 2025", category: "Guide" },
  { id: "3", title: "The Making of 'Golden Whisper'", excerpt: "An intimate look behind the scenes of one of the most beloved pieces in the collection — the process, the intention, the journey.", coverImage: "/images/artwork-6.png", author: "Tasmiya Fathima Azeez", readTime: "5 min read", date: "April 2025", category: "Studio" },
  { id: "4", title: "Arabic Calligraphy: The Living Art", excerpt: "Exploring the spiritual dimension of Arabic script and how it transforms letters into light, movement, and meaning.", coverImage: "/images/artwork-3.png", author: "Tasmiya Fathima Azeez", readTime: "7 min read", date: "March 2025", category: "Tutorials" },
  { id: "5", title: "Caring for Your Original Artwork", excerpt: "Practical advice on framing, hanging, climate, and preserving the investment and beauty of your original piece.", coverImage: "/images/artwork-5.png", author: "Tasmiya Fathima Azeez", readTime: "3 min read", date: "February 2025", category: "Guide" },
  { id: "6", title: "Upcoming Exhibition: The Light Within", excerpt: "Preview of the forthcoming collection exploring inner light through the lens of Islamic mysticism and contemporary minimalism.", coverImage: "/images/artwork-8.png", author: "Tasmiya Fathima Azeez", readTime: "4 min read", date: "January 2025", category: "Exhibitions" },
];

export default function Blog() {
  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Studio Stories</span>
          <h1 className="font-heading text-5xl sm:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Journal</h1>
        </motion.div>

        {/* Featured post */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border/50 group cursor-pointer">
            <div className="aspect-video lg:aspect-auto overflow-hidden bg-muted">
              <img src={POSTS[0].coverImage} alt={POSTS[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center glassmorphism">
              <span className="text-xs tracking-widest uppercase text-accent mb-3 font-body block" style={{ fontFamily: "'Cinzel', serif" }}>{POSTS[0].category}</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-light leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{POSTS[0].title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{POSTS[0].excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span>{POSTS[0].date}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{POSTS[0].readTime}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 text-accent text-sm font-semibold group-hover:gap-4 transition-all font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Read More <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.slice(1).map((post, i) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden border border-border/50 group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden bg-muted">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="text-[10px] tracking-widest uppercase text-accent mb-2 block font-body" style={{ fontFamily: "'Cinzel', serif" }}>{post.category}</span>
                <h3 className="font-heading text-xl leading-snug mb-3 group-hover:text-accent transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{post.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4 font-body line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
