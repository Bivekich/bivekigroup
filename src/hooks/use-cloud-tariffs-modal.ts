import { create } from 'zustand';

interface CloudTariffsModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCloudTariffsModal = create<CloudTariffsModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
