import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          return { items: exists ? state.items.filter((i) => i.id !== item.id) : [...state.items, item] };
        }),
      isInWishlist: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "bayt-al-fann-wishlist" }
  )
);
