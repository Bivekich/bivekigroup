import { create } from 'zustand';

type ContactModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useContactModal = create<ContactModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
