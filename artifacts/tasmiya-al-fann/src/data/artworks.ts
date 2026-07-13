export type ArtworkCategory = 'Abstract' | 'Islamic Art' | 'Portraits' | 'Calligraphy' | 'Nature' | 'Modern Art';

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  artist: string;
  category: ArtworkCategory;
  price: number;
  currency: 'INR';
  image: string;
  width: number;
  height: number;
  medium: string;
  year: number;
  description: string;
  story: string;
  available: boolean;
  featured: boolean;
  isFeatured: boolean;
  popular: boolean;
  tags: string[];
}

export const categories: Category[] = [
  { id: 'cat-1', name: 'Abstract', slug: 'abstract', emoji: '🌊' },
  { id: 'cat-2', name: 'Islamic Art', slug: 'islamic-art', emoji: '🕌' },
  { id: 'cat-3', name: 'Calligraphy', slug: 'calligraphy', emoji: '✍️' },
  { id: 'cat-4', name: 'Portraits', slug: 'portraits', emoji: '🎭' },
  { id: 'cat-5', name: 'Nature', slug: 'nature', emoji: '🌿' },
];

export const artworks: Artwork[] = [
  {
    id: "art-001", slug: "golden-whisper",
    title: "Golden Whisper", artist: "Tasmiya Fathima Azeez",
    category: "Abstract", price: 1200, currency: "INR",
    image: "/images/artwork-1.png", width: 60, height: 80,
    medium: "Oil and Gold Leaf on Canvas", year: 2024,
    description: "A symphony of warm amber and soft ivory, representing the quiet moments of dawn.",
    story: "Inspired by the morning light hitting the dunes of the desert, this piece aims to capture the fleeting warmth that begins the day.",
    available: true, featured: true, isFeatured: true, popular: true,
    tags: ["gold", "warm", "amber", "ivory", "abstract"]
  },
  {
    id: "art-002", slug: "sacred-geometry-i",
    title: "Sacred Geometry I", artist: "Tasmiya Fathima Azeez",
    category: "Islamic Art", price: 850, currency: "INR",
    image: "/images/artwork-2.png", width: 50, height: 50,
    medium: "Mixed Media on Parchment", year: 2023,
    description: "Subtle geometric interlacing that reflects the infinite nature of the universe.",
    story: "Created during a period of deep meditation, the repetition of patterns served as a visual dhikr (remembrance).",
    available: true, featured: false, isFeatured: false, popular: true,
    tags: ["geometric", "islamic", "minimalist", "parchment"]
  },
  {
    id: "art-003", slug: "divine-echoes",
    title: "Divine Echoes", artist: "Tasmiya Fathima Azeez",
    category: "Calligraphy", price: 1500, currency: "INR",
    image: "/images/artwork-3.png", width: 70, height: 100,
    medium: "Acrylic and Gold Ink", year: 2024,
    description: "Sweeping Arabic calligraphy merging with abstract forms.",
    story: "The words 'Noor' (Light) are woven into the canvas, meant to bring a sense of luminous presence to any room.",
    available: false, featured: true, isFeatured: true, popular: true,
    tags: ["calligraphy", "gold", "elegant", "light"]
  },
  {
    id: "art-004", slug: "desert-winds",
    title: "Desert Winds", artist: "Tasmiya Fathima Azeez",
    category: "Abstract", price: 950, currency: "INR",
    image: "/images/artwork-4.png", width: 80, height: 60,
    medium: "Textured Paste and Acrylic", year: 2023,
    description: "Minimalist representation of shifting sands and temporal beauty.",
    story: "A tactile exploration of nature's ability to constantly reshape itself while maintaining its essence.",
    available: true, featured: false, isFeatured: false, popular: false,
    tags: ["sand", "flowing", "beige", "texture"]
  },
  {
    id: "art-005", slug: "veiled-empathy",
    title: "Veiled Empathy", artist: "Tasmiya Fathima Azeez",
    category: "Portraits", price: 1800, currency: "INR",
    image: "/images/artwork-5.png", width: 60, height: 80,
    medium: "Oil on Linen", year: 2025,
    description: "An expressive, semi-abstract portrait exploring human emotion and connection.",
    story: "This piece delves into the unseen emotional landscapes we carry, brought to the surface through warm, vigorous brushwork.",
    available: true, featured: true, isFeatured: true, popular: false,
    tags: ["portrait", "expressive", "emotive", "warm"]
  },
  {
    id: "art-006", slug: "amber-resonance",
    title: "Amber Resonance", artist: "Tasmiya Fathima Azeez",
    category: "Modern Art", price: 1100, currency: "INR",
    image: "/images/artwork-6.png", width: 50, height: 50,
    medium: "Plaster and Acrylic", year: 2024,
    description: "Bold charcoal and amber strokes on a heavily textured ivory base.",
    story: "A study in contrast: the soft, quiet background violently interrupted by deliberate, passionate marks.",
    available: true, featured: false, isFeatured: true, popular: true,
    tags: ["modern", "texture", "charcoal", "amber"]
  },
  {
    id: "art-007", slug: "eternal-path",
    title: "Eternal Path", artist: "Tasmiya Fathima Azeez",
    category: "Calligraphy", price: 1350, currency: "INR",
    image: "/images/artwork-7.png", width: 80, height: 60,
    medium: "Charcoal and Gold Leaf", year: 2024,
    description: "Contemporary calligraphic strokes traversing the canvas like a journey.",
    story: "Representing the spiritual path, the strokes are dark and heavy but always guided by subtle hints of gold.",
    available: true, featured: false, isFeatured: false, popular: false,
    tags: ["charcoal", "journey", "calligraphy"]
  },
  {
    id: "art-008", slug: "the-archway",
    title: "The Archway", artist: "Tasmiya Fathima Azeez",
    category: "Islamic Art", price: 1600, currency: "INR",
    image: "/images/artwork-8.png", width: 60, height: 80,
    medium: "Oil on Canvas", year: 2023,
    description: "A serene interpretation of classical Moorish architecture.",
    story: "An invitation to step through into a place of quiet reflection. The muted gold reflects ancient wisdom.",
    available: false, featured: true, isFeatured: true, popular: true,
    tags: ["arch", "architecture", "serene", "gold"]
  },
  {
    id: "art-009", slug: "quiet-contemplation",
    title: "Quiet Contemplation", artist: "Tasmiya Fathima Azeez",
    category: "Portraits", price: 1450, currency: "INR",
    image: "/images/artwork-9.png", width: 50, height: 50,
    medium: "Watercolor and Pastel", year: 2025,
    description: "A soft silhouette bathed in warm studio light.",
    story: "Capturing a rare moment of complete stillness in the artist's studio before the creation process begins.",
    available: true, featured: false, isFeatured: false, popular: false,
    tags: ["silhouette", "soft", "stillness", "studio"]
  },
  {
    id: "art-010", slug: "tactile-ivory",
    title: "Tactile Ivory", artist: "Tasmiya Fathima Azeez",
    category: "Modern Art", price: 800, currency: "INR",
    image: "/images/artwork-10.png", width: 80, height: 60,
    medium: "Mixed Media Plaster", year: 2024,
    description: "A purely textural experience exploring the nuances of white, ivory, and sand.",
    story: "Stripping away color to focus entirely on shadow and form, this piece requires the viewer to step close and engage.",
    available: true, featured: false, isFeatured: false, popular: true,
    tags: ["texture", "ivory", "minimalist", "white"]
  }
];
