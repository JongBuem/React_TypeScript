import { create } from 'zustand';

export const adProfileStore = create((set) => ({
  adProfile: {},
  setAdProfile(v) {
    set((state) => ({ adProfile: (state.adProfile = v) }));
  },
}));
