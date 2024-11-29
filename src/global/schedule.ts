import { create } from "zustand";

// 타입 정의
interface ScheduleListStore {
  scheduleList: any[]; // 필요한 경우 any를 구체적인 타입으로 변경
  setScheduleList: (v: any[]) => void;
}

interface ScheduleHostLogStore {
  scheduleHostLog: any[]; // 필요한 경우 any를 구체적인 타입으로 변경
  setScheduleHostLog: (v: any[]) => void;
  jobCount: string | number;
  setJobCount: (v: string | number) => void;
}

interface ScheduleLogStore {
  scheduleLog: any[]; // 필요한 경우 any를 구체적인 타입으로 변경
  setScheduleLog: (v: any[]) => void;
  jobCount: string | number; // "all" 또는 number로 사용할 경우 타입을 조정 가능
  setJobCount: (v: string | number) => void;
  action: string; // 필요한 경우 더 구체적인 타입으로 설정
  setAction: (v: string) => void;
  status: string; // 필요한 경우 더 구체적인 타입으로 설정
  setStatus: (v: string) => void;
}

// store 생성
export const scheduleListStore = create<ScheduleListStore>((set) => ({
  scheduleList: [],
  setScheduleList(v) {
    set(() => ({ scheduleList: v }));
  },
}));

export const scheduleHostLogStore = create<ScheduleHostLogStore>((set) => ({
  scheduleHostLog: [],
  setScheduleHostLog(v) {
    set(() => ({ scheduleHostLog: v }));
  },

  jobCount: 0,
  setJobCount(v) {
    set(() => ({ jobCount: v }));
  },
}));

export const scheduleLogStore = create<ScheduleLogStore>((set) => ({
  scheduleLog: [],
  setScheduleLog(v) {
    set(() => ({ scheduleLog: v }));
  },

  jobCount: "all",
  setJobCount(v) {
    set(() => ({ jobCount: v }));
  },

  action: "all",
  setAction(v) {
    set(() => ({ action: v }));
  },

  status: "all",
  setStatus(v) {
    set(() => ({ status: v }));
  },
}));
