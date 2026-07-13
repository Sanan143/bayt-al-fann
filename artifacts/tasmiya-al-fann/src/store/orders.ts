import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  artwork: string;
  total: string;
  status: "paid" | "shipped" | "pending" | "cancelled" | "delivered";
  paymentMethod?: "cod" | "qr";
  paymentProof?: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: "#1001", customer: "Aisha Rahman", email: "aisha@example.com", phone: "+91 98765 43210", address: "12, Rose Villa, Bangalore, Karnataka - 560001", artwork: "Golden Whisper", total: "₹1,200", status: "paid" },
  { id: "#1002", customer: "Kareem Hassan", email: "kareem@example.com", phone: "+91 99999 88888", address: "45, Green Meadows, Chennai, Tamil Nadu - 600002", artwork: "The Archway", total: "₹1,600", status: "shipped" },
  { id: "#1003", customer: "Fatima Noor", email: "fatima@example.com", phone: "+91 88888 77777", address: "88, Crescent Residency, Hyderabad, Telangana - 500003", artwork: "Divine Echoes", total: "₹1,500", status: "pending" },
];

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: Order["status"]) => void;
  deleteOrder: (id: string) => void;
}

export const useOrders = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: INITIAL_ORDERS,
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateStatus: (id, status) => set((state) => ({
        orders: state.orders.map((o) => o.id === id ? { ...o, status } : o)
      })),
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter((o) => o.id !== id)
      })),
    }),
    { name: "bayt-al-fann-orders" }
  )
);
