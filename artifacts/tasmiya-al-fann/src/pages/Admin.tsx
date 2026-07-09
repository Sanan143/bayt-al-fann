import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Image, BookOpen, Calendar, ShoppingBag,
  Brush, MessageSquare, Settings, LogOut, TrendingUp, Users,
  Package, Eye, Plus, Edit, Trash2, Lock, X, Check, AlertTriangle,
  Star, ChevronDown,
} from "lucide-react";
import { useArtworksStore } from "@/store/artworks";
import type { Artwork, ArtworkCategory } from "@/store/artworks";

// ─── Constants ───────────────────────────────────────────────────────────────
const ADMIN_USER = "tasmiyaazeez";
const ADMIN_PASS = "tasmiyasherni";

const CATEGORIES: ArtworkCategory[] = [
  "Abstract", "Islamic Art", "Portraits", "Calligraphy", "Nature", "Modern Art",
];

const MOCK_ORDERS = [
  { id: "#1001", customer: "Aisha Rahman", artwork: "Golden Whisper", total: "$1,200", status: "paid" },
  { id: "#1002", customer: "Kareem Hassan", artwork: "The Archway", total: "$1,600", status: "shipped" },
  { id: "#1003", customer: "Fatima Noor", artwork: "Divine Echoes", total: "$1,500", status: "pending" },
];

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
};

const AVAILABILITY_OPTIONS = ["available", "sold", "reserved"] as const;

// ─── Artwork Form ─────────────────────────────────────────────────────────────
type ArtworkFormData = Omit<Artwork, "id">;

const BLANK_FORM: ArtworkFormData = {
  slug: "",
  title: "",
  artist: "Tasmiya Fathima Azeez",
  category: "Abstract",
  price: 500,
  currency: "USD",
  image: "",
  width: 60,
  height: 80,
  medium: "",
  year: new Date().getFullYear(),
  description: "",
  story: "",
  available: true,
  featured: false,
  isFeatured: false,
  popular: false,
  tags: [],
};

function ArtworkModal({
  mode,
  initial,
  onSave,
  onClose,
}: {
  mode: "add" | "edit";
  initial: ArtworkFormData;
  onSave: (data: ArtworkFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ArtworkFormData>(initial);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          set("image", dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function set<K extends keyof ArtworkFormData>(key: K, value: ArtworkFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.medium.trim()) e.medium = "Medium is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.price <= 0) e.price = "Price must be greater than 0";
    if (form.width <= 0) e.width = "Width must be positive";
    if (form.height <= 0) e.height = "Height must be positive";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    set("tags", form.tags.filter((t) => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSave({ ...form, slug });
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body transition-colors";
  const labelCls = "block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider font-body";
  const errCls = "text-xs text-destructive mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
      />
      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-3xl shadow-2xl border border-border"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-border bg-background rounded-t-3xl">
          <h2 className="font-heading text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {mode === "add" ? "Add New Artwork" : "Edit Artwork"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {/* Title + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                id="artwork-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Golden Whisper"
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              {errors.title && <p className={errCls}>{errors.title}</p>}
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <div className="relative">
                <select
                  id="artwork-category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as ArtworkCategory)}
                  className={`${inputCls} appearance-none pr-8`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Price + Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Price (USD) *</label>
              <input
                id="artwork-price"
                type="number" min={0}
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              {errors.price && <p className={errCls}>{errors.price}</p>}
            </div>
            <div>
              <label className={labelCls}>Width (cm) *</label>
              <input
                id="artwork-width"
                type="number" min={0}
                value={form.width}
                onChange={(e) => set("width", Number(e.target.value))}
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              {errors.width && <p className={errCls}>{errors.width}</p>}
            </div>
            <div>
              <label className={labelCls}>Height (cm) *</label>
              <input
                id="artwork-height"
                type="number" min={0}
                value={form.height}
                onChange={(e) => set("height", Number(e.target.value))}
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              {errors.height && <p className={errCls}>{errors.height}</p>}
            </div>
          </div>

          {/* Medium + Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Medium *</label>
              <input
                id="artwork-medium"
                value={form.medium}
                onChange={(e) => set("medium", e.target.value)}
                placeholder="e.g. Oil and Gold Leaf on Canvas"
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              {errors.medium && <p className={errCls}>{errors.medium}</p>}
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input
                id="artwork-year"
                type="number" min={1900} max={2100}
                value={form.year}
                onChange={(e) => set("year", Number(e.target.value))}
                className={inputCls}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          </div>

          {/* Artwork Image Upload */}
          <div>
            <label className={labelCls}>Artwork Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border hover:border-accent/40 rounded-2xl transition-colors bg-card/40 relative overflow-hidden group">
              {form.image ? (
                <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-xl overflow-hidden bg-muted border border-border">
                  <img
                    src={form.image}
                    alt="Artwork preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 animate-fade-in">
                    <label className="p-2.5 bg-background rounded-full hover:bg-muted text-foreground cursor-pointer transition-transform hover:scale-105">
                      <Edit size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => set("image", "")}
                      className="p-2.5 bg-background rounded-full hover:bg-destructive hover:text-white text-destructive transition-transform hover:scale-105"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center py-4">
                  <div className="mx-auto h-12 w-12 text-muted-foreground flex items-center justify-center rounded-full bg-muted/60">
                    <Plus size={24} className="text-muted-foreground/80" />
                  </div>
                  <div className="flex text-sm text-muted-foreground justify-center font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <label className="relative cursor-pointer rounded-md font-semibold text-accent hover:text-accent/80 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        id="artwork-image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground/60 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>PNG, JPG, GIF up to 5MB (auto-compressed)</p>
                </div>
              )}
              {!form.image && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              id="artwork-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Short description visible on the gallery card…"
              className={`${inputCls} resize-none`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            {errors.description && <p className={errCls}>{errors.description}</p>}
          </div>

          {/* Story */}
          <div>
            <label className={labelCls}>Story (optional)</label>
            <textarea
              id="artwork-story"
              value={form.story}
              onChange={(e) => set("story", e.target.value)}
              rows={3}
              placeholder="The inspiration behind this piece…"
              className={`${inputCls} resize-none`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex gap-2">
              <input
                id="artwork-tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="e.g. gold, abstract…  (press Enter)"
                className={`${inputCls} flex-1`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <button type="button" onClick={addTag}
                className="px-4 py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-body hover:bg-accent/20 transition-colors border border-accent/30"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs font-body border border-border"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                { key: "available" as const, label: "Available" },
                { key: "isFeatured" as const, label: "Featured" },
                { key: "popular" as const, label: "Popular" },
              ]
            ).map(({ key, label }) => (
              <label key={key}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all select-none font-body text-sm ${form[key] ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-accent/40"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                <input type="checkbox" className="sr-only" checked={Boolean(form[key])}
                  onChange={(e) => {
                    set(key, e.target.checked);
                    if (key === "isFeatured") set("featured", e.target.checked);
                  }} />
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${form[key] ? "bg-accent border-accent" : "border-border"}`}>
                  {form[key] && <Check size={10} className="text-white" />}
                </div>
                {label}
              </label>
            ))}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-border text-sm font-body hover:bg-muted transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-body font-semibold hover:bg-accent/90 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              {mode === "add" ? "Add Artwork" : "Save Changes"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────
function DeleteConfirm({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onCancel}
      />
      <motion.div
        className="relative w-full max-w-sm bg-background rounded-2xl shadow-2xl border border-border p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-destructive" />
        </div>
        <h3 className="font-heading text-xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Delete Artwork?</h3>
        <p className="text-muted-foreground text-sm mb-6 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <strong>"{title}"</strong> will be permanently removed from the gallery.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel}
            className="px-6 py-2.5 rounded-full border border-border text-sm font-body hover:bg-muted transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-6 py-2.5 rounded-full bg-destructive text-white text-sm font-body font-semibold hover:bg-destructive/90 transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      onLogin();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => { setErr(false); setShake(false); }, 2200);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground px-4"
      style={{ background: "radial-gradient(ellipse at 60% 30%, hsl(26 30% 18%) 0%, hsl(0 0% 5%) 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-10">
          <motion.div
            className="w-16 h-16 rounded-full border border-accent/40 flex items-center justify-center mx-auto mb-5"
            style={{ background: "radial-gradient(circle, hsl(36 60% 25%), hsl(36 30% 15%))" }}
            animate={{ boxShadow: ["0 0 20px hsl(46 68% 47% / 0.2)", "0 0 40px hsl(46 68% 47% / 0.4)", "0 0 20px hsl(46 68% 47% / 0.2)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Lock size={26} className="text-accent" />
          </motion.div>
          <div className="text-[10px] tracking-[0.5em] uppercase text-accent/60 mb-2 font-body" style={{ fontFamily: "'Cinzel', serif" }}>بيت الفن</div>
          <h1 className="font-heading text-3xl text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Admin Portal</h1>
          <p className="text-white/30 text-xs mt-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>Restricted access · Bayt Al Fann</p>
        </div>

        <motion.form
          onSubmit={submit}
          className="space-y-4"
          animate={shake ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div>
            <input
              id="admin-username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              className="w-full px-5 py-3.5 rounded-2xl text-white placeholder:text-white/30 border text-sm focus:outline-none focus:ring-2 transition-all font-body"
              style={{
                fontFamily: "'Poppins', sans-serif",
                background: "hsl(0 0% 100% / 0.06)",
                borderColor: err ? "hsl(0 72% 51% / 0.6)" : "hsl(0 0% 100% / 0.1)",
              }}
            />
          </div>
          <div>
            <input
              id="admin-password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full px-5 py-3.5 rounded-2xl text-white placeholder:text-white/30 border text-sm focus:outline-none focus:ring-2 transition-all font-body"
              style={{
                fontFamily: "'Poppins', sans-serif",
                background: "hsl(0 0% 100% / 0.06)",
                borderColor: err ? "hsl(0 72% 51% / 0.6)" : "hsl(0 0% 100% / 0.1)",
              }}
            />
          </div>
          <AnimatePresence>
            {err && (
              <motion.p
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-red-400 text-xs text-center font-body"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Invalid credentials. Please try again.
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl text-white text-sm font-semibold transition-colors font-body"
            style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(135deg, hsl(46 68% 40%), hsl(36 60% 32%))" }}
          >
            Sign In to Admin
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "artworks", label: "Artworks", Icon: Image },
  { id: "orders", label: "Orders", Icon: ShoppingBag },
  { id: "commissions", label: "Commissions", Icon: Brush },
  { id: "blog", label: "Blog", Icon: BookOpen },
  { id: "exhibitions", label: "Exhibitions", Icon: Calendar },
  { id: "messages", label: "Messages", Icon: MessageSquare },
  { id: "settings", label: "Settings", Icon: Settings },
];

// ─── Artworks CRUD Panel ──────────────────────────────────────────────────────
function ArtworksPanel() {
  const { artworks, addArtwork, updateArtwork, deleteArtwork } = useArtworksStore();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; artwork?: Artwork } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Artwork | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const filtered = artworks.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSave(data: Omit<Artwork, "id">) {
    if (modal?.mode === "add") {
      addArtwork(data);
      showToast(`"${data.title}" added to gallery ✦`);
    } else if (modal?.artwork) {
      updateArtwork(modal.artwork.id, data);
      showToast(`"${data.title}" updated successfully ✦`);
    }
    setModal(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteArtwork(deleteTarget.id);
    showToast(`"${deleteTarget.title}" removed from gallery`, "error");
    setDeleteTarget(null);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            id="admin-artwork-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artworks…"
            className="w-full pl-4 pr-4 py-2.5 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-body"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
        </div>
        <div className="text-muted-foreground text-sm font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {filtered.length} artwork{filtered.length !== 1 ? "s" : ""}
        </div>
        <motion.button
          id="admin-add-artwork-btn"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setModal({ mode: "add" })}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full text-sm font-body font-semibold hover:bg-accent/90 transition-colors flex-shrink-0"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <Plus size={15} /> Add Artwork
        </motion.button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
          No artworks found.
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, height: 0 }}
                className="glassmorphism p-4 rounded-2xl flex items-center gap-4 group"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                  {a.image ? (
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={20} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-lg leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{a.title}</div>
                  <div className="text-xs text-muted-foreground font-body mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {a.category} · {a.medium} · ${a.price.toLocaleString()}
                  </div>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-semibold ${a.available ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {a.available ? "Available" : "Sold"}
                    </span>
                    {a.isFeatured && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-body font-semibold bg-accent/15 text-accent"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>
                        ✦ Featured
                      </span>
                    )}
                    {a.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-body font-semibold bg-purple-100 text-purple-700"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <Star size={8} className="inline" /> Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    id={`edit-artwork-${a.id}`}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setModal({ mode: "edit", artwork: a })}
                    className="p-2 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
                    title="Edit artwork"
                  >
                    <Edit size={15} />
                  </motion.button>
                  <motion.button
                    id={`delete-artwork-${a.id}`}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteTarget(a)}
                    className="p-2 rounded-lg hover:bg-red-50 hover:text-destructive transition-colors"
                    title="Delete artwork"
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modal && (
          <ArtworkModal
            mode={modal.mode}
            initial={modal.artwork ? { ...modal.artwork } : { ...BLANK_FORM }}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirm
            title={deleteTarget.title}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[60] px-6 py-3 rounded-2xl shadow-xl text-sm font-body font-semibold ${toast.type === "success" ? "bg-accent text-white" : "bg-destructive text-white"}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardPanel({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { artworks } = useArtworksStore();

  const totalRevenue = artworks.reduce((sum, a) => (!a.available ? sum + a.price : sum), 0);
  const availableCount = artworks.filter((a) => a.available).length;
  const featuredCount = artworks.filter((a) => a.isFeatured).length;

  const STATS = [
    { label: "Total Artworks", value: artworks.length.toString(), change: "+live", Icon: Image, color: "text-accent" },
    { label: "Available", value: availableCount.toString(), change: "In gallery", Icon: Eye, color: "text-green-600" },
    { label: "Featured", value: featuredCount.toString(), change: "On homepage", Icon: Star, color: "text-purple-600" },
    { label: "Est. Revenue", value: `$${(totalRevenue).toLocaleString()}`, change: "Sold works", Icon: TrendingUp, color: "text-blue-600" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, change, Icon, color }) => (
          <div key={label} className="glassmorphism p-5 rounded-2xl">
            <div className={`mb-3 ${color}`}><Icon size={20} /></div>
            <div className="font-heading text-2xl sm:text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</div>
            <div className="text-xs text-muted-foreground mt-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</div>
            <div className="text-xs text-accent font-semibold mt-1 font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="glassmorphism p-6 rounded-2xl">
          <h3 className="font-heading text-xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recent Orders</h3>
          <div className="space-y-3">
            {MOCK_ORDERS.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                <div>
                  <div className="text-sm font-medium font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{o.customer}</div>
                  <div className="text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{o.artwork} · {o.id}</div>
                </div>
                <div className="text-right">
                  <div className="font-heading text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{o.total}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_COLOR[o.status]}`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Quick actions */}
        <div className="glassmorphism p-6 rounded-2xl">
          <h3 className="font-heading text-xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Artwork", Icon: Plus, tab: "artworks" },
              { label: "View Orders", Icon: Package, tab: "orders" },
              { label: "New Blog Post", Icon: BookOpen, tab: "blog" },
              { label: "Messages", Icon: MessageSquare, tab: "messages" },
            ].map(({ label, Icon, tab }) => (
              <button key={label} onClick={() => onNavigate(tab)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all font-body"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Icon size={20} className="text-accent" />
                <span className="text-xs text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-foreground/[0.03] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-foreground flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        <div className="p-6 border-b border-background/10">
          <div className="text-background">
            <div className="text-[10px] tracking-[0.4em] uppercase text-accent/70 font-body mb-1" style={{ fontFamily: "'Cinzel', serif" }}>بيت الفن</div>
            <div className="font-heading text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Admin Portal</div>
            <div className="text-[10px] text-background/30 font-body mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>Signed in as admin</div>
          </div>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              id={`admin-nav-${id}`}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left font-body ${activeTab === id ? "bg-accent text-white shadow-md" : "text-background/60 hover:bg-background/10 hover:text-background"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-background/10">
          <button
            onClick={() => setLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-background/60 hover:bg-background/10 hover:text-background transition-all font-body"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-foreground/50 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <LayoutDashboard size={18} />
          </button>
          <h2 className="font-heading text-2xl capitalize flex-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
          </h2>
          {activeTab === "artworks" && (
            <span className="text-xs text-muted-foreground font-body hidden sm:block" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Changes save automatically to local storage
            </span>
          )}
        </div>

        <div className="p-6">
          {activeTab === "dashboard" && <DashboardPanel onNavigate={setActiveTab} />}
          {activeTab === "artworks" && <ArtworksPanel />}

          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {MOCK_ORDERS.map((o) => (
                <div key={o.id} className="glassmorphism p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="font-heading text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{o.customer}</div>
                    <div className="text-xs text-muted-foreground font-body" style={{ fontFamily: "'Poppins', sans-serif" }}>{o.artwork} · {o.id}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{o.total}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-body ${STATUS_COLOR[o.status]}`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}>{o.status}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {!["dashboard", "artworks", "orders"].includes(activeTab) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                {(() => { const item = NAV_ITEMS.find((n) => n.id === activeTab); return item ? <item.Icon size={24} /> : null; })()}
              </div>
              <h3 className="font-heading text-2xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
              </h3>
              <p className="text-sm font-body text-center max-w-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Coming soon. Connect the live API backend with a valid DATABASE_URL to enable this section.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
