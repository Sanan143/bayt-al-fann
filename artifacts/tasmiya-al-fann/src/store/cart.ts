import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artwork } from '@/data/artworks';

interface CartItem {
  artwork: Artwork;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (artwork: Artwork) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  get total(): number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (artwork) => set((state) => {
        const existingItem = state.items.find(item => item.artwork.id === artwork.id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.artwork.id === artwork.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true
          };
        }
        return { items: [...state.items, { artwork, quantity: 1 }], isOpen: true };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.artwork.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.artwork.id === id ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      get total() {
        return get().items.reduce((sum, item) => sum + item.artwork.price * item.quantity, 0);
      }
    }),
    {
      name: 'tasmiya-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
