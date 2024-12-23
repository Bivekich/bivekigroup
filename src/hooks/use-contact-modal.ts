import { create } from 'zustand';
import { MouseEvent } from 'react';

type ContactModalStore = {
  isOpen: boolean;
  tariff?: string;
  page?: string;
  open: (e?: MouseEvent) => void;
  openWithData: (data?: { tariff?: string; page?: string }) => void;
  close: () => void;
};

export const useContactModal = create<ContactModalStore>((set) => ({
  isOpen: false,
  tariff: undefined,
  page: undefined,
  open: () => set({ isOpen: true }),
  openWithData: (data) => set({ isOpen: true, ...data }),
  close: () => set({ isOpen: false, tariff: undefined, page: undefined }),
}));
