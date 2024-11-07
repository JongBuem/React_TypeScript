import { create } from "zustand";

export const customerStore = create((set) => ({
  customer: {},
  setCustomer(v) {
    set((state) => ({ customer: (state.customer = v) }));
  },
}));
