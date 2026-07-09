import { create } from "zustand";
import { persist } from "zustand/middleware";
import { artworks as SEED_ARTWORKS, categories as SEED_CATEGORIES } from "@/data/artworks";
import type { Artwork, Category, ArtworkCategory } from "@/data/artworks";

export type { Artwork, Category, ArtworkCategory };

interface ArtworksStore {
  artworks: Artwork[];
  categories: Category[];
  // CRUD
  addArtwork: (artwork: Omit<Artwork, "id">) => void;
  updateArtwork: (id: string, updates: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  // Category helpers
  addCategory: (category: Omit<Category, "id">) => void;
}

export const useArtworksStore = create<ArtworksStore>()(
  persist(
    (set) => ({
      artworks: SEED_ARTWORKS,
      categories: SEED_CATEGORIES,

      addArtwork: (artwork) =>
        set((state) => ({
          artworks: [
            ...state.artworks,
            {
              ...artwork,
              id: `art-${Date.now()}`,
            },
          ],
        })),

      updateArtwork: (id, updates) =>
        set((state) => ({
          artworks: state.artworks.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteArtwork: (id) =>
        set((state) => ({
          artworks: state.artworks.filter((a) => a.id !== id),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id: `cat-${Date.now()}` },
          ],
        })),
    }),
    { name: "bayt-al-fann-artworks" }
  )
);
