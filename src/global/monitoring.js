import { create } from 'zustand';

export const monitoringDataStore = create((set) => ({
  data: [],
  setData(v) {
    set((state) => ({ data: (state.data = v) }));
  },
}));

export const monitoringHostStore = create((set) => ({
  host: [],
  setHost(v) {
    set((state) => ({ host: (state.host = v) }));
  },
}));

export const monitoringVmStore = create((set) => ({
  vm: [],
  setVm(v) {
    set((state) => ({ vm: (state.vm = v) }));
  },
}));
