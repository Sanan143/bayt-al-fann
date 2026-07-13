import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  email: string; // The user's email associated with the thread
  sender: "user" | "admin";
  senderName: string;
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", email: "aisha@example.com", sender: "user", senderName: "Aisha Rahman", text: "Hi Tasmiya, is 'Golden Whisper' still available for framing customization?", timestamp: "10:30 AM" },
  { id: "m2", email: "aisha@example.com", sender: "admin", senderName: "Tasmiya Fathima Azeez", text: "Hi Aisha! Yes, we can customize the frame to dark walnut or gold gilt. Let me know which matches your gallery wall.", timestamp: "11:15 AM" },
  { id: "m3", email: "fatima@example.com", sender: "user", senderName: "Fatima Noor", text: "Salam, I loved the calligraphy collection! Do you take custom Arabic names commissions?", timestamp: "02:22 PM" },
  { id: "m4", email: "fatima@example.com", sender: "admin", senderName: "Tasmiya Fathima Azeez", text: "Walaikum Assalam Fatima! Yes, I regularly do custom commissions for family names and Quranic verses. Please submit a request via the Commission tab!", timestamp: "03:05 PM" }
];

interface MessagesStore {
  messages: Message[];
  sendMessage: (email: string, sender: "user" | "admin", senderName: string, text: string) => void;
}

export const useMessages = create<MessagesStore>()(
  persist(
    (set) => ({
      messages: INITIAL_MESSAGES,
      sendMessage: (email, sender, senderName, text) => set((state) => {
        const newMessage: Message = {
          id: `m_${Date.now()}`,
          email,
          sender,
          senderName,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return { messages: [...state.messages, newMessage] };
      }),
    }),
    { name: "bayt-al-fann-messages" }
  )
);
