import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

const EXHIBITIONS = [
  { id: "1", title: "The Light Within", status: "upcoming", startDate: "Aug 15, 2025", endDate: "Sep 30, 2025", location: "Virtual Gallery · Global", description: "A collection exploring inner light through Islamic mysticism and contemporary minimalism. 24 new works.", coverImage: "/images/artwork-8.png" },
  { id: "2", title: "Geometry of the Soul", status: "active", startDate: "Jun 1, 2025", endDate: "Jul 31, 2025", location: "Dubai Art Hub, UAE", description: "An exploration of sacred Islamic geometric patterns reimagined for the modern aesthetic.", coverImage: "/images/artwork-2.png" },
  { id: "3", title: "Desert Whispers", status: "past", startDate: "Jan 10, 2025", endDate: "Feb 28, 2025", location: "Chennai Art Gallery, India", description: "A sold-out exhibition featuring 18 original works inspired by desert landscapes and Quranic verse.", coverImage: "/images/artwork-4.png" },
  { id: "4", title: "Noor — The Light Collection", status: "past", startDate: "Oct 5, 2024", endDate: "Nov 20, 2024", location: "London Islamic Art Fair", description: "Showcasing the complete Noor series. All 12 works acquired by private collectors within opening week.", coverImage: "/images/artwork-3.png" },
];

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  past: "bg-muted text-muted-foreground",
};

export default function Exhibitions() {
  const grouped = {
    active: EXHIBITIONS.filter(e => e.status === "active"),
    upcoming: EXHIBITIONS.filter(e => e.status === "upcoming"),
    past: EXHIBITIONS.filter(e => e.status === "past"),
  };

  return (
    <main className="pt-24 pb-40 lg:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-semibold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Around the World</span>
          <h1 className="font-heading text-5xl sm:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Exhibitions</h1>
        </motion.div>

        {Object.entries(grouped).map(([group, exhs]) => exhs.length > 0 && (
          <section key={group} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-heading text-2xl capitalize" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {group === "active" ? "Currently Showing" : group === "upcoming" ? "Coming Soon" : "Past Exhibitions"}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exhs.map((ex, i) => (
                <motion.div key={ex.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="rounded-3xl overflow-hidden border border-border/50 group hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img src={ex.coverImage} alt={ex.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                    <span className={`absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full font-body ${statusColors[ex.status]}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {ex.status}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-2xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{ex.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{ex.description}</p>
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="flex items-center gap-2"><Calendar size={12} />{ex.startDate} – {ex.endDate}</span>
                      <span className="flex items-center gap-2"><MapPin size={12} />{ex.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
