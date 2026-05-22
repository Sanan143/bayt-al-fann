import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (id) => set((state) => ({
        items: state.items.includes(id)
          ? state.items.filter(itemId => itemId !== id)
          : [...state.items, id]
      })),
      hasItem: (id) => get().items.includes(id),
    }),
    {
      name: 'tasmiya-wishlist-storage',
    }
  )
);
