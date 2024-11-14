import { create } from "zustand";

export const scheduleListStore = create((set) => ({
  scheduleList: [],
  setScheduleList(v) {
    set((state) => ({ scheduleList: (state.scheduleList = v) }));
  },
}));

export const scheduleHostLogStore = create((set) => ({
  scheduleHostLog: [],
  setScheduleHostLog(v) {
    set((state) => ({ scheduleHostLog: (state.scheduleHostLog = v) }));
  },

  jobCount: 0,
  setJobCount(v) {
    set((state) => ({ jobCount: (state.jobCount = v) }));
  },
}));

export const scheduleLogStore = create((set) => ({
  scheduleLog: [],
  setScheduleLog(v) {
    set((state) => ({ scheduleLog: (state.scheduleLog = v) }));
  },

  jobCount: "all",
  setJobCount(v) {
    set((state) => ({ jobCount: (state.jobCount = v) }));
  },

  action: "all",
  setAction(v) {
    set((state) => ({ action: (state.action = v) }));
  },

  status: "all",
  setStatus(v) {
    set((state) => ({ status: (state.status = v) }));
  },
}));
