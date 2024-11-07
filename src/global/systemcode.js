import { create } from 'zustand';

export const systemcodeStore = create((set) => ({
  systemcode: [],
  setSystemcode(v) {
    set((state) => ({ systemcode: (state.systemcode = v) }));
  },
}));
